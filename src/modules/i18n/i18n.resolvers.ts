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
import { DataLoaderService } from "../../prisma/dataloader.service.js";
import {
  ThinTranslation,
  I18nString,
  Language,
  Translation,
  ThinI18nString,
} from "./i18n.models.js";
import { I18nService } from "./i18n.service.js";

@Resolver(Language)
export class I18nLanguageResolver {
  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Language, { nullable: true })
  async language(
    @Args("id", { type: () => Int, nullable: true }) id: number | undefined,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<Language | null> {
    if (id != null) {
      return this.dataLoader.findById(this.i18n.languages, id);
    } else {
      let allLanguages = await this.i18n.getAllLanguages();
      return this.i18n.resolveLanguage(lang ?? context, allLanguages);
    }
  }
  @Query(() => [Language], { nullable: true, complexity: est => 10 * est.childComplexity })
  async languages(): Promise<Language[] | null> {
    return this.i18n.getAllLanguages();
  }

  @ResolveField(() => I18nString)
  async name_i18n(@Parent() language: Language): Promise<I18nString> {
    // Note: I18nString doesn't have any fields and is only used transiently
    // return (await this.i18n.findStringById(language.name_id))!;
    return { id: language.name_id };
  }

  @ResolveField(() => String)
  async name(
    @Parent() language: Language,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(language.name_id, lang ?? context);
  }

  @ResolveField(() => String)
  async local_name(@Parent() language: Language): Promise<string> {
    return this.i18n.resolve(language.name_id, language.id);
  }
  @ResolveField(() => String)
  async english_name(@Parent() language: Language): Promise<string> {
    return this.i18n.resolve(language.name_id, (await this.i18n.getEnglish())?.id);
  }
}

@Resolver(I18nString)
export class I18nStringResolver {
  constructor(private readonly i18n: I18nService) {}

  @Query(() => I18nString, { nullable: true })
  async i18n_string(@Args("id", { type: () => Int }) id: number): Promise<I18nString | null> {
    return this.i18n.findStringById(id);
  }

  @ResolveField(() => [Translation], { complexity: est => 10 * est.childComplexity })
  async translations(@Parent() i18nString: I18nString): Promise<Translation[]> {
    return this.i18n.findTranslationsByStringId(i18nString.id);
  }

  @ResolveField(() => String)
  async value(
    @Parent() i18nString: I18nString,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(i18nString.id, lang ?? context);
  }
}

@Resolver(ThinI18nString)
export class I18nThinStringResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async value(
    @Parent() thinI18nString: ThinI18nString,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolveTranslation(thinI18nString.translations, lang ?? context);
  }
}

@Resolver(Translation)
export class I18nTranslationResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => I18nString)
  async string(@Parent() translation: Translation): Promise<I18nString> {
    return (await this.i18n.findStringById(translation.language_id))!;
  }
  @ResolveField(() => Language)
  async language(@Parent() translation: Translation): Promise<Language> {
    return (await this.i18n.findLanguageById(translation.language_id))!;
  }
}

@Resolver(ThinTranslation)
export class I18nThinTranslationResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => Language)
  async language(@Parent() translation: ThinTranslation): Promise<Language> {
    return (await this.i18n.findLanguageById(translation.language_id))!;
  }
}
