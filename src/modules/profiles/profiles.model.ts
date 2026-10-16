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
  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;
}

@ObjectType()
export class ProfileLink {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  profile_id: number;
  @Field(() => Int)
  order: number;
  @Field(() => I18nString)
  text_i18n: I18nString;
  @Field(() => Int)
  text_id: number;
  @Field(() => String)
  url: string;
}

@ObjectType()
export class WorkExperience {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  profile_id: number;
  @Field(() => Int)
  company_id: number;
  @Field(() => I18nString)
  title_i18n: I18nString;
  @Field(() => Int)
  title_id: number;
  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;

  @Field(() => Date)
  started_at: Date;
  @Field(() => Date, { nullable: true })
  finished_at: Date | null;
}

@ObjectType()
export class WorkAchievement {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  work_experience_id: number;

  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;
}

@ObjectType()
export class ProjectExperience {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  profile_id: number;
  @Field(() => Int)
  project_id: number;
  @Field(() => I18nString)
  title_i18n: I18nString;
  @Field(() => Int)
  title_id: number;
  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;

  @Field(() => Date)
  started_at: Date;
  @Field(() => Date, { nullable: true })
  finished_at: Date | null;
}

@ObjectType()
export class ProjectAchievement {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  project_experience_id: number;

  @Field(() => I18nString)
  description_i18n: I18nString;
  @Field(() => Int)
  description_id: number;
}
