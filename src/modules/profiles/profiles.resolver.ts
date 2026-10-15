import {
  Args,
  Context,
  GqlExecutionContext,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AnonI18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Profile } from "./profiles.model.js";
import { ProfilesService } from "./profiles.service.js";

@Resolver(Profile)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly i18nService: I18nService,
  ) {}

  @Query(() => Profile, { nullable: true })
  async profile(@Args("id", { type: () => Int }) id: number): Promise<Profile | null> {
    return this.profilesService.findById(id);
  }

  @ResolveField(() => String)
  async first_name(
    @Parent() profile: Profile,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18nService.resolve(profile.first_name_i18n, context);
  }

  @ResolveField(() => String)
  async last_name(
    @Parent() profile: Profile,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18nService.resolve(profile.last_name_i18n, context);
  }

  @ResolveField(() => AnonI18nString)
  full_name_i18n(@Parent() profile: Profile): AnonI18nString {
    return this.i18nService.combineStrings(
      profile.first_name_i18n,
      profile.last_name_i18n,
      (first_name, last_name) => `${first_name} ${last_name}`,
    );
  }

  @ResolveField(() => String)
  async full_name(
    @Parent() profile: Profile,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18nService.resolve(this.full_name_i18n(profile), context);
  }
}
