import { IncomingMessage } from "node:http";
import { ExecutionContext, Injectable } from "@nestjs/common";
import acceptLanguageParser from "accept-language-parser";
import { PrismaService } from "../../prisma/prisma.service.js";
import { I18nString, Language, Translation } from "./i18n.models.js";

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

  async resolve(string: I18nString, context: ExecutionContext): Promise<string> {
    // Parse the "Accept-Language" header
    let header = ((context as any).req as IncomingMessage).headers["accept-language"];
    let accepts = acceptLanguageParser.parse(header);

    // Get the languages that this string supports
    let allLanguages = await this.getAllLanguages();
    let available = string.translations.map(tr =>
      allLanguages.find(lang => lang.id === tr.language_id)!,
    );

    // Pick a fitting language (or fall back to the first added translation - likely original)
    let resolvedIetfTag = acceptLanguageParser.pick(
      available.map(x => x.ietf_tag),
      accepts,
    );

    if (!resolvedIetfTag) {
      // TODO: This can only happen with a database that wasn't filled out correctly (I18nString
      // without any associated translations). Should the database not allow such state?
      return "";
    }

    // Get the translation for the resolved language
    let resolvedLangId = available.find(lang => lang.ietf_tag === resolvedIetfTag)!.id;
    let translation = string.translations.find(tr => tr.language_id === resolvedLangId)!;

    return translation.value;
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
