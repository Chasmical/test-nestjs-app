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
import { I18nString, ThinI18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Project } from "../projects/projects.model.js";
import { ProjectsService } from "../projects/projects.service.js";
import { Skill } from "../skills/skills.model.js";
import { SkillsService } from "../skills/skills.service.js";
import {
  Profile,
  ProfileLink,
  ProjectAchievement,
  ProjectExperience,
  ProjectSkill,
  WorkAchievement,
  WorkExperience,
  WorkSkill,
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

  @ResolveField(() => I18nString)
  async first_name_i18n(@Parent() profile: Profile): Promise<I18nString> {
    return (await this.i18n.findStringById(profile.first_name_id))!;
  }
  @ResolveField(() => I18nString)
  async last_name_i18n(@Parent() profile: Profile): Promise<I18nString> {
    return (await this.i18n.findStringById(profile.last_name_id))!;
  }
  @ResolveField(() => I18nString)
  async description_i18n(@Parent() profile: Profile): Promise<I18nString> {
    return (await this.i18n.findStringById(profile.description_id))!;
  }

  @ResolveField(() => String)
  async first_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.first_name_id, lang ?? context);
  }
  @ResolveField(() => String)
  async last_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.last_name_id, lang ?? context);
  }
  @ResolveField(() => String)
  async description(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(profile.description_id, lang ?? context);
  }

  @ResolveField(() => ThinI18nString)
  async full_name_i18n(@Parent() profile: Profile): Promise<ThinI18nString> {
    return this.i18n.combineStrings(
      await this.i18n.findTranslationsByStringId(profile.first_name_id),
      await this.i18n.findTranslationsByStringId(profile.first_name_id),
      (first_name, last_name) => `${first_name} ${last_name}`,
    );
  }
  @ResolveField(() => String)
  async full_name(
    @Parent() profile: Profile,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    let translations = (await this.full_name_i18n(profile)).translations;
    return this.i18n.resolveTranslation(translations, lang ?? context);
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

  @ResolveField(() => [Skill], { complexity: est => 10 * est.childComplexity })
  async skills(@Parent() profile: Profile): Promise<Skill[]> {
    return this.profilesService.getProfileSkills(profile.id);
  }
}

@Resolver(ProfileLink)
export class ProfileLinksResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => I18nString)
  async text_i18n(@Parent() link: ProfileLink): Promise<I18nString> {
    return (await this.i18n.findStringById(link.text_id))!;
  }

  @ResolveField(() => String)
  async text(
    @Parent() link: ProfileLink,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(link.text_id, lang ?? context);
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

  @ResolveField(() => I18nString)
  async title_i18n(@Parent() exp: WorkExperience): Promise<I18nString> {
    return (await this.i18n.findStringById(exp.title_id))!;
  }

  @ResolveField(() => String)
  async title(
    @Parent() exp: WorkExperience,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(exp.title_id, lang ?? context);
  }

  @ResolveField(() => [WorkSkill], { complexity: est => 10 * est.childComplexity })
  async skills(@Parent() exp: WorkExperience): Promise<WorkSkill[]> {
    return this.profilesService.getWorkSkills(exp.id);
  }
  @ResolveField(() => [WorkAchievement], { complexity: est => 10 * est.childComplexity })
  async achievements(@Parent() exp: WorkExperience): Promise<WorkAchievement[]> {
    return this.profilesService.getWorkAchievements(exp.id);
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

  @ResolveField(() => I18nString, { nullable: true })
  async title_i18n(@Parent() exp: ProjectExperience): Promise<I18nString | null> {
    return exp.title_id ? (await this.i18n.findStringById(exp.title_id))! : null;
  }

  @ResolveField(() => String, { nullable: true })
  async title(
    @Parent() exp: ProjectExperience,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string | null> {
    return exp.title_id ? this.i18n.resolve(exp.title_id, lang ?? context) : null;
  }

  @ResolveField(() => [ProjectSkill], { complexity: est => 10 * est.childComplexity })
  async skills(@Parent() exp: ProjectExperience): Promise<ProjectSkill[]> {
    return this.profilesService.getProjectSkills(exp.id);
  }
  @ResolveField(() => [ProjectAchievement], { complexity: est => 10 * est.childComplexity })
  async achievements(@Parent() exp: ProjectExperience): Promise<ProjectAchievement[]> {
    return this.profilesService.getProjectAchievements(exp.id);
  }
}

@Resolver(WorkSkill)
export class WorkSkillsResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly skillsService: SkillsService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => WorkExperience)
  async work_experience(@Parent() skill: WorkSkill): Promise<WorkExperience> {
    return (await this.profilesService.findWorkExperienceById(skill.work_experience_id))!;
  }
  @ResolveField(() => Skill)
  async skill(@Parent() skill: WorkSkill): Promise<Skill> {
    return (await this.skillsService.findById(skill.skill_id))!;
  }
  @ResolveField(() => String)
  async skill_name(
    @Parent() skill: WorkSkill,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve((await this.skill(skill)).name_id, lang ?? context);
  }
}

@Resolver(ProjectSkill)
export class ProjectSkillsResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly skillsService: SkillsService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => ProjectExperience)
  async project_experience(@Parent() exp: ProjectSkill): Promise<ProjectExperience> {
    return (await this.profilesService.findProjectExperienceById(exp.project_experience_id))!;
  }
  @ResolveField(() => Skill)
  async skill(@Parent() skill: ProjectSkill): Promise<Skill> {
    return (await this.skillsService.findById(skill.skill_id))!;
  }
  @ResolveField(() => String)
  async skill_name(
    @Parent() skill: ProjectSkill,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve((await this.skill(skill)).name_id, lang ?? context);
  }
}

@Resolver(WorkAchievement)
export class WorkAchievementsResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => I18nString)
  async description_i18n(@Parent() achievement: WorkAchievement): Promise<I18nString> {
    return (await this.i18n.findStringById(achievement.description_id))!;
  }

  @ResolveField(() => String)
  async description(
    @Parent() achievement: WorkAchievement,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(achievement.description_id, lang ?? context);
  }
}

@Resolver(ProjectAchievement)
export class ProjectAchievementsResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => I18nString)
  async description_i18n(@Parent() achievement: WorkAchievement): Promise<I18nString> {
    return (await this.i18n.findStringById(achievement.description_id))!;
  }

  @ResolveField(() => String)
  async description(
    @Parent() achievement: ProjectAchievement,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(achievement.description_id, lang ?? context);
  }
}
