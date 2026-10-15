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
  @Field(() => String)
  value: string;

  @Field(() => I18nString)
  string?: I18nString;
  @Field(() => Int)
  string_id: number;
  @Field(() => Language)
  language?: Language;
  @Field(() => Int)
  language_id: number;
}
