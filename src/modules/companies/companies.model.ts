import { Field, Int, ObjectType } from "@nestjs/graphql";
import { I18nString } from "../i18n/i18n.models.js";

@ObjectType()
export class Company {
  @Field(() => Int)
  id: number;

  @Field(() => I18nString)
  name_i18n: I18nString;
  @Field(() => Int)
  name_id: number;
}

@ObjectType()
export class CompanyLink {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  company_id: number;
  @Field(() => Int)
  order: number;
  @Field(() => I18nString)
  text_i18n: I18nString;
  @Field(() => Int)
  text_id: number;
  @Field(() => String)
  url: string;
}
