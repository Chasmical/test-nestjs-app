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
import { Company } from "../companies/companies.model.js";
import { CompaniesService } from "../companies/companies.service.js";
import { ThinI18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Project } from "../projects/projects.model.js";
import { ProjectsService } from "../projects/projects.service.js";
import {
  Profile,
  ProfileLink,
  ProjectAchievement,
  ProjectExperience,
  WorkAchievement,
  WorkExperience,
} from "./profiles.model.js";
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

  @ResolveField(() => String)
  async description(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.description_i18n, lang ?? context);
  }

  @ResolveField(() => [ProfileLink], { complexity: est => 10 * est.childComplexity })
  async links(@Parent() profile: Profile): Promise<ProfileLink[]> {
    return this.profilesService.getProfileLinks(profile.id);
  }
  @ResolveField(() => [WorkExperience], { complexity: est => 10 * est.childComplexity })
  async work_experiences(@Parent() profile: Profile): Promise<WorkExperience[]> {
    return this.profilesService.getWorkExperiences(profile.id);
  }
  @ResolveField(() => [ProjectExperience], { complexity: est => 10 * est.childComplexity })
  async project_experiences(@Parent() profile: Profile): Promise<ProjectExperience[]> {
    return this.profilesService.getProjectExperiences(profile.id);
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

@Resolver(WorkExperience)
export class WorkExperiencesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly companiesService: CompaniesService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => Profile)
  async profile(@Parent() exp: WorkExperience): Promise<Profile> {
    return (await this.profilesService.findById(exp.profile_id))!;
  }
  @ResolveField(() => Company)
  async company(@Parent() exp: WorkExperience): Promise<Company> {
    return (await this.companiesService.findById(exp.company_id))!;
  }

  @ResolveField(() => String)
  async title(
    @Parent() exp: WorkExperience,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(exp.title_i18n, lang ?? context);
  }

  @ResolveField(() => [WorkAchievement], { complexity: est => 10 * est.childComplexity })
  async achievements(@Parent() exp: WorkExperience): Promise<WorkAchievement[]> {
    return this.profilesService.getWorkAchievements(exp.id);
  }
}

@Resolver(WorkAchievement)
export class WorkAchievementsResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async description(
    @Parent() achievement: WorkAchievement,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(achievement.description_i18n, lang ?? context);
  }
}

@Resolver(ProjectExperience)
export class ProjectExperiencesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly projectsService: ProjectsService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => Profile)
  async profile(@Parent() exp: ProjectExperience): Promise<Profile> {
    return (await this.profilesService.findById(exp.profile_id))!;
  }
  @ResolveField(() => Project)
  async project(@Parent() exp: ProjectExperience): Promise<Project> {
    return (await this.projectsService.findById(exp.project_id))!;
  }

  @ResolveField(() => String, { nullable: true })
  async title(
    @Parent() exp: ProjectExperience,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string | null> {
    return exp.title_i18n ? this.i18n.resolve(exp.title_i18n, lang ?? context) : null;
  }

  @ResolveField(() => [ProjectAchievement], { complexity: est => 10 * est.childComplexity })
  async achievements(@Parent() exp: ProjectExperience): Promise<ProjectAchievement[]> {
    return this.profilesService.getProjectAchievements(exp.id);
  }
}

@Resolver(ProjectAchievement)
export class ProjectAchievementsResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async description(
    @Parent() achievement: ProjectAchievement,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(achievement.description_i18n, lang ?? context);
  }
}
