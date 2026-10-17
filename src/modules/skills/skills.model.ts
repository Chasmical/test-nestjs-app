import { Field, Int, ObjectType } from "@nestjs/graphql";
import { I18nString } from "../i18n/i18n.models.js";

@ObjectType()
export class Skill {
  @Field(() => Int)
  id: number;

  @Field(() => I18nString)
  name_i18n: I18nString;
  @Field(() => Int)
  name_id: number;
}
