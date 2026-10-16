import { IncomingMessage } from "node:http";
import { ExecutionContext, Injectable } from "@nestjs/common";
import acceptLanguageParser from "accept-language-parser";
import { PrismaService } from "../../prisma/prisma.service.js";
import { ThinI18nString, I18nString, Language, Translation } from "./i18n.models.js";

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
  private allLanguages$: Promise<Language[]>;
  private englishLanguage$: Promise<Language | null>;

  async getAllLanguages() {
    return (this.allLanguages$ ??= this.prisma.language.findMany({
      include: { name_i18n: INCLUDE_I18N },
    }));
  }
  async getEnglish(): Promise<Language | null> {
    return (this.englishLanguage$ ??= this.findLanguageByExact({ ietf_tag: "en-US" }));
  }

  async findLanguageByExact(
    where: { id: number } | { ietf_tag: string },
  ): Promise<Language | null> {
    let allLanguages = await this.getAllLanguages();
    if ("id" in where && where.id != null) {
      return allLanguages.find(x => x.id === where.id) ?? null;
    } else {
      return allLanguages.find(x => x.ietf_tag === (where as any).ietf_tag) ?? null;
    }
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

  resolve(string: ThinI18nString, language_id: number | null | undefined): string;
  resolve(string: ThinI18nString, acceptLanguage: string): Promise<string>;
  resolve(string: ThinI18nString, context: ExecutionContext): Promise<string>;
  resolve(
    string: ThinI18nString,
    acceptLanguage: ExecutionContext | string | number | null | undefined,
  ): Promise<string> | string;
  resolve(
    string: ThinI18nString,
    acceptLanguage: ExecutionContext | string | number | null | undefined,
  ): Promise<string> | string {
    // If provided null or an id, return a translation with that language id
    if (acceptLanguage == null || typeof acceptLanguage === "number") {
      let match = string.translations.find(tr => tr.language_id === acceptLanguage);
      return (match ?? string.translations.at(0))?.value ?? "";
    }

    return this.getAllLanguages().then(allLanguages => {
      // Get all the languages that this string supports
      let available = string.translations.map(tr =>
        allLanguages.find(lang => lang.id === tr.language_id)!,
      );
      // Find the most fitting language, or fall back to the first translation
      let lang = this.resolveLanguage(acceptLanguage, available) ?? available[0];
      let translation = string.translations.find(tr => tr.language_id === lang.id);
      return translation?.value ?? "";
    });
  }

  combineStrings(
    left: ThinI18nString,
    right: ThinI18nString,
    combine: (a: string, b: string) => string,
  ): ThinI18nString {
    // Find all the different languages that we need to output
    let langIds = new Set<number>();
    left.translations.forEach(tr => langIds.add(tr.language_id));
    right.translations.forEach(tr => langIds.add(tr.language_id));

    // Combine individual translations
    const translations = [...langIds].map(langId => ({
      language_id: langId,
      value: combine(this.resolve(left, langId), this.resolve(right, langId)),
    }));
    return { translations };
  }

  async findStringById(id: number): Promise<I18nString | null> {
    return this.prisma.i18nString.findUnique({
      where: { id },
      ...INCLUDE_I18N,
    });
  }

  async findTranslationById(string_id: number, language_id: number): Promise<Translation | null> {
    return this.prisma.translation.findUnique({
      where: { string_id_language_id: { string_id, language_id } },
    });
  }
}
