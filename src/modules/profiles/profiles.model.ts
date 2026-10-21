import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  first_name_id: number;
  @Field(() => Int)
  last_name_id: number;
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
  @Field(() => Int)
  title_id: number;

  @Field(() => Date)
  started_at: Date;
  @Field(() => Date, { nullable: true })
  finished_at: Date | null;
}

@ObjectType()
export class WorkSkill {
  @Field(() => Int)
  work_experience_id: number;
  @Field(() => Int)
  skill_id: number;
}

@ObjectType()
export class WorkAchievement {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  work_experience_id: number;
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
  @Field(() => Int, { nullable: true })
  title_id: number | null;

  @Field(() => Date)
  started_at: Date;
  @Field(() => Date, { nullable: true })
  finished_at: Date | null;
}

@ObjectType()
export class ProjectSkill {
  @Field(() => Int)
  project_experience_id: number;
  @Field(() => Int)
  skill_id: number;
}

@ObjectType()
export class ProjectAchievement {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  project_experience_id: number;
  @Field(() => Int)
  description_id: number;
}
