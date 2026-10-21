import { IncomingMessage } from "node:http";
import { ExecutionContext, Injectable } from "@nestjs/common";
import acceptLanguageParser from "accept-language-parser";
import DataLoader from "dataloader";
import { BatchableService } from "../../prisma/dataloader.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
  I18nString,
  Language,
  ThinI18nString,
  ThinTranslation,
  Translation,
} from "./i18n.models.js";

export const INCLUDE_I18N = {
  include: { translations: true },
};
export const INCLUDE_I18N_THIN = {
  select: { translations: { select: { language_id: true, value: true } } },
};

@Injectable()
export class I18nService {
  constructor(private readonly prisma: PrismaService) {}

  // Languages aren't usually changed, but are accessed often, so we'll cache them
  private allLanguages$?: Promise<Language[]>;
  private englishLanguage$?: Promise<Language | null>;

  async getAllLanguages() {
    return (this.allLanguages$ ??= this.prisma.language.findMany());
  }
  async getEnglish(): Promise<Language | null> {
    return (this.englishLanguage$ ??= this.findLanguageByTag("en-US"));
  }

  languages: BatchableService<number, Language | null> = {
    // createLoader: opt => this.prisma.createLoaderById("language", opt),
    createLoader: () =>
      new DataLoader(async (ids: readonly number[]) => {
        let all = await this.getAllLanguages();
        return ids.map(id => all.find(lang => lang.id === id) ?? null);
      }),
  };
  languagesByTag: BatchableService<string, Language | null> = {
    // createLoader: opt => this.prisma.createLoaderByUniqueField("language", "ietf_tag", opt),
    createLoader: () =>
      new DataLoader(async (tags: readonly string[]) => {
        let all = await this.getAllLanguages();
        return tags.map(tag => all.find(lang => lang.ietf_tag === tag) ?? null);
      }),
  };
  i18nStrings: BatchableService<number, I18nString | null> = {
    createLoader: opt => this.prisma.createLoaderById("i18nString", opt),
  };
  translations: BatchableService<number, Translation[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("translation", "string_id", opt),
  };

  findLanguageById(id: number): Promise<Language | null> {
    return this.languages.createLoader({ batch: false }).load(id);
  }
  findLanguageByTag(ietf_tag: string): Promise<Language | null> {
    return this.languagesByTag.createLoader({ batch: false }).load(ietf_tag);
  }
  findStringById(id: number): Promise<I18nString | null> {
    return this.i18nStrings.createLoader({ batch: false }).load(id);
  }
  findTranslationsByStringId(string_id: number): Promise<Translation[]> {
    return this.translations.createLoader({ batch: false }).load(string_id);
  }

  resolveLanguage(
    acceptLanguage: ExecutionContext | string | null | undefined,
    available: Language[],
  ): Language | null {
    // If provided an ExecutionContext, extract the "Accept-Language" header from it
    if (typeof acceptLanguage !== "string") {
      let req = (acceptLanguage as any).req as IncomingMessage;
      acceptLanguage = req.headers["accept-language"] ?? "";
    }
    // Otherwise, the provided string will be used as an "Accept-Language" value

    let resolvedTag = acceptLanguageParser.pick(
      available.map(x => x.ietf_tag),
      acceptLanguage ?? "",
    );

    // Get the language back from the resolved IETF tag
    return available.find(lang => lang.ietf_tag === resolvedTag) ?? null;
  }

  resolveTranslation(
    translations: ThinTranslation[],
    acceptLanguage: number | null | undefined,
  ): string;
  resolveTranslation(
    translations: ThinTranslation[],
    acceptLanguage: ExecutionContext | string | number | null | undefined,
  ): Promise<string>;
  resolveTranslation(
    translations: ThinTranslation[],
    acceptLanguage: ExecutionContext | string | number | null | undefined,
  ): Promise<string> | string {
    // If provided null or an id, return a translation with that language id
    if (acceptLanguage == null || typeof acceptLanguage === "number") {
      let match = translations.find(tr => tr.language_id === acceptLanguage);
      return (match ?? translations.at(0))?.value ?? "";
    }

    return this.getAllLanguages().then(allLanguages => {
      // Get all the languages that this string supports
      let available = translations.map(tr =>
        allLanguages.find(lang => lang.id === tr.language_id)!,
      );
      // Find the most fitting language, or fall back to the first translation
      let lang = this.resolveLanguage(acceptLanguage, available) ?? available[0];
      let translation = translations.find(tr => tr.language_id === lang.id);
      return translation?.value ?? "";
    });
  }

  async resolve(
    string_id: number,
    acceptLanguage: ExecutionContext | string | number | null | undefined,
  ): Promise<string> {
    let translations = await this.findTranslationsByStringId(string_id);
    return this.resolveTranslation(translations, acceptLanguage);
  }

  combineStrings(
    left: ThinTranslation[],
    right: ThinTranslation[],
    combine: (a: string, b: string) => string,
  ): ThinI18nString {
    // Find all the different languages that we need to output
    let langIds = new Set<number>();
    left.forEach(tr => langIds.add(tr.language_id));
    right.forEach(tr => langIds.add(tr.language_id));

    // Combine individual translations
    const translations = [...langIds].map(langId => ({
      language_id: langId,
      value: combine(this.resolveTranslation(left, langId), this.resolveTranslation(right, langId)),
    }));
    return { translations };
  }
}
