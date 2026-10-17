import { Field, ObjectType, Int } from "@nestjs/graphql";
import { I18nString } from "../i18n/i18n.models.js";

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field(() => I18nString)
  name_i18n: I18nString;
  @Field(() => Int)
  name_id: number;
  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;
}

@ObjectType()
export class ProjectLink {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  project_id: number;

  @Field(() => I18nString)
  text_i18n: I18nString;
  @Field(() => Int)
  text_id: number;
  @Field(() => String)
  url: string;
}
