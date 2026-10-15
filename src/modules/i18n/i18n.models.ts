import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class I18nString {
  @Field(() => Int)
  id: number;
  @Field(() => [Translation])
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

// Anonymous I18nString and Translation, without assigned ids (used by profile().full_name_i18n)
@ObjectType()
export class AnonI18nString {
  @Field(() => [AnonTranslation])
  translations: AnonTranslation[];
}

@ObjectType()
export class AnonTranslation {
  @Field(() => Int)
  language_id: number;
  @Field(() => String)
  value: string;
}
