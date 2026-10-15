import { IncomingMessage } from "node:http";
import { ExecutionContext, Injectable } from "@nestjs/common";
import acceptLanguageParser from "accept-language-parser";
import { PrismaService } from "../../prisma/prisma.service.js";
import { AnonI18nString, I18nString, Language, Translation } from "./i18n.models.js";

@Injectable()
export class I18nService {
  // Languages are only loaded once, since they're not changed often
  private languages: Language[] = [];
  private languages$: Promise<Language[]>;

  constructor(private readonly prisma: PrismaService) {
    this.languages$ = this.reloadAllLanguages();
  }

  private async reloadAllLanguages() {
    let languages = await this.prisma.language.findMany({
      include: { name_i18n: { include: { translations: true } } },
    });
    this.languages = languages;
    return languages;
  }
  async getAllLanguages() {
    return this.languages$;
  }

  async resolve(string: AnonI18nString, context: ExecutionContext): Promise<string> {
    // Get all the languages that this string supports
    let allLanguages = await this.getAllLanguages();
    let available = string.translations.map(tr =>
      allLanguages.find(lang => lang.id === tr.language_id)!,
    );

    // Use the "Accept-Language" header to pick the most fitting language
    let acceptLanguage = ((context as any).req as IncomingMessage).headers["accept-language"];
    let resolvedTag = acceptLanguageParser.pick(
      available.map(x => x.ietf_tag),
      acceptLanguage ?? "",
    );
    // Fall back to the first available translation
    let resolvedLang = available.find(lang => lang.ietf_tag === resolvedTag) ?? available.at(0);

    if (!resolvedLang) {
      // TODO: This can only happen with a database that wasn't filled out correctly (I18nString
      // without any associated translations). Should the database not allow such state?
      return "";
    }

    let translation = string.translations.find(tr => tr.language_id === resolvedLang.id)!;

    return translation.value;
  }

  resolveWithId(string: AnonI18nString, language_id: number | null | undefined): string {
    let match = string.translations.find(tr => tr.language_id == language_id);
    return (match ?? string.translations.at(0))?.value ?? "";
  }

  combineStrings(
    left: AnonI18nString,
    right: AnonI18nString,
    combine: (a: string, b: string) => string,
  ): AnonI18nString {
    // Find all the different languages that we need to output
    let langIds = new Set<number>();
    left.translations.forEach(tr => langIds.add(tr.language_id));
    right.translations.forEach(tr => langIds.add(tr.language_id));

    // Combine individual translations
    const translations = [...langIds].map(langId => {
      let a = left.translations.find(tr => tr.language_id == langId) ?? left.translations.at(0);
      let b = right.translations.find(tr => tr.language_id == langId) ?? right.translations.at(0);
      return { language_id: langId, value: combine(a?.value ?? "", b?.value ?? "") };
    });
    return { translations };
  }

  async findLanguageBy(
    where:
      | { id: number }
      | { two_char_code: string }
      | { three_char_code: string }
      | { ietf_tag: string },
  ): Promise<Language | null> {
    return this.prisma.language.findUnique({
      where,
      include: {
        name_i18n: { include: { translations: true } },
      },
    });
  }

  async findStringById(id: number): Promise<I18nString | null> {
    return this.prisma.i18nString.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async findTranslationById(string_id: number, language_id: number): Promise<Translation | null> {
    return this.prisma.translation.findUnique({
      where: { string_id_language_id: { string_id, language_id } },
    });
  }
}
