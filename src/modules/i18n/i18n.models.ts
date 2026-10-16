import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class I18nString {
  @Field(() => Int)
  id: number;
  @Field(() => [Translation], { complexity: est => 10 * est.childComplexity })
  translations: Translation[];
}

@ObjectType()
export class Language {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  ietf_tag: string;
  @Field(() => String, { nullable: true })
  two_char_code: string | null;
  @Field(() => String, { nullable: true })
  three_char_code: string | null;

  @Field(() => I18nString)
  name_i18n: I18nString;
  @Field(() => Int)
  name_id: number;
}

@ObjectType()
export class Translation {
  @Field(() => Int)
  string_id: number;
  @Field(() => Int)
  language_id: number;
  @Field(() => String)
  value: string;
}

// Thin variants of I18nString and Translation, only with bare minimum required data,
// that can be used to refer to strings/translations that don't have database rows:
// { translations { language_id, value } }
@ObjectType()
export class ThinI18nString {
  @Field(() => [ThinTranslation], { complexity: est => 10 * est.childComplexity })
  translations: ThinTranslation[];
}

@ObjectType()
export class ThinTranslation {
  @Field(() => Int)
  language_id: number;
  @Field(() => String)
  value: string;
}
