import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  first_name: string;
  @Field(() => String)
  last_name: string;

  @Field(() => String)
  full_name?: string;
}
