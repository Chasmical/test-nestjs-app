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
import { ThinI18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Profile, ProfileLink } from "./profiles.model.js";
import { ProfilesService } from "./profiles.service.js";

@Resolver(Profile)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Profile, { nullable: true })
  async profile(@Args("id", { type: () => Int }) id: number): Promise<Profile | null> {
    return this.profilesService.findById(id);
  }

  @ResolveField(() => String)
  async first_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.first_name_i18n, lang ?? context);
  }

  @ResolveField(() => String)
  async last_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.last_name_i18n, lang ?? context);
  }

  @ResolveField(() => ThinI18nString)
  full_name_i18n(@Parent() profile: Profile): ThinI18nString {
    return this.i18n.combineStrings(
      profile.first_name_i18n,
      profile.last_name_i18n,
      (first_name, last_name) => `${first_name} ${last_name}`,
    );
  }

  @ResolveField(() => String)
  async full_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(this.full_name_i18n(profile), lang ?? context);
  }

  @ResolveField(() => [ProfileLink])
  async links(@Parent() profile: Profile): Promise<ProfileLink[]> {
    return this.profilesService.getProfileLinks(profile.id);
  }
}

@Resolver(ProfileLink)
export class ProfileLinksResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async text(
    @Parent() link: ProfileLink,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(link.text_i18n, lang ?? context);
  }
}
