import { Args, Int, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";
import { Profile } from "./profiles.model.js";
import { ProfilesService } from "./profiles.service.js";

@Resolver(Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Query(() => Profile, { nullable: true })
  async profile(@Args("id", { type: () => Int }) id: number): Promise<Profile | null> {
    return this.profilesService.findById(id);
  }

  @ResolveField()
  full_name(@Root() profile: Profile): string {
    return profile.first_name + " " + profile.last_name;
  }
}
