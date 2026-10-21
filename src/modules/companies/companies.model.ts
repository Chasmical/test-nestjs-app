import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Company {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  name_id: number;
  @Field(() => Int)
  description_id: number;
}

@ObjectType()
export class CompanyLink {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  company_id: number;

  @Field(() => Int)
  order: number;
  @Field(() => Int)
  text_id: number;
  @Field(() => String)
  url: string;
}
