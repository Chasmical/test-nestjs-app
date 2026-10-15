import {
  Args,
  Context,
  GqlExecutionContext,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AnonTranslation, I18nString, Language, Translation } from "./i18n.models.js";
import { I18nService } from "./i18n.service.js";

@Resolver(Language)
export class I18nLanguageResolver {
  private englishLangId$: Promise<number | null | undefined>;

  constructor(private readonly i18nService: I18nService) {
    // We're expecting the English language record to have the "en-US" IETF tag
    this.englishLangId$ = this.i18nService
      .findLanguageBy({ ietf_tag: "en-US" })
      .then(lang => lang?.id);
  }

  @Query(() => Language, { nullable: true })
  async language(@Args("id", { type: () => Int }) id: number): Promise<Language | null> {
    return this.i18nService.findLanguageBy({ id });
  }
  @Query(() => [Language], { nullable: true, complexity: est => 10 * est.childComplexity })
  async languages(): Promise<Language[] | null> {
    return this.i18nService.getAllLanguages();
  }

  @ResolveField(() => String)
  async name(
    @Parent() language: Language,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18nService.resolve(language.name_i18n, context);
  }

  @ResolveField(() => String)
  async local_name(@Parent() language: Language): Promise<string> {
    return this.i18nService.resolveWithId(language.name_i18n, language.id);
  }
  @ResolveField(() => String)
  async english_name(@Parent() language: Language): Promise<string> {
    return this.i18nService.resolveWithId(language.name_i18n, await this.englishLangId$);
  }
}

@Resolver(I18nString)
export class I18nStringResolver {
  constructor(private readonly i18nService: I18nService) {}

  @Query(() => I18nString, { nullable: true })
  async i18n_string(@Args("id", { type: () => Int }) id: number): Promise<I18nString | null> {
    return this.i18nService.findStringById(id);
  }
}

@Resolver(Translation)
export class I18nTranslationResolver {
  constructor(private readonly i18nService: I18nService) {}

  @Query(() => Translation, { nullable: true })
  async translation(
    @Args("string_id", { type: () => Int }) string_id: number,
    @Args("lang_id", { type: () => Int }) lang_id: number,
  ): Promise<Translation | null> {
    return this.i18nService.findTranslationById(string_id, lang_id);
  }

  @ResolveField(() => Language)
  async language(@Parent() translation: Translation): Promise<Language> {
    return (await this.i18nService.findLanguageBy({ id: translation.language_id }))!;
  }
  @ResolveField(() => I18nString)
  async string(@Parent() translation: Translation): Promise<I18nString> {
    return (await this.i18nService.findStringById(translation.language_id))!;
  }
}

@Resolver(AnonTranslation)
export class I18nAnonTranslationResolver {
  constructor(private readonly i18nService: I18nService) {}

  @ResolveField(() => Language)
  async language(@Parent() translation: Translation): Promise<Language> {
    return (await this.i18nService.findLanguageBy({ id: translation.language_id }))!;
  }
}
