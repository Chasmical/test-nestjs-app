import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  name_id: number;
  @Field(() => Int)
  description_id: number;
}

@ObjectType()
export class ProjectLink {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  project_id: number;

  @Field(() => Int)
  text_id: number;
  @Field(() => String)
  url: string;
}
