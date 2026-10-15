import { Field, ObjectType, Int } from "@nestjs/graphql";
import { I18nString } from "../i18n/i18n.models.js";

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field(() => I18nString)
  first_name_i18n: I18nString;
  @Field(() => Int)
  first_name_id: number;
  @Field(() => I18nString)
  last_name_i18n: I18nString;
  @Field(() => Int)
  last_name_id: number;
}
