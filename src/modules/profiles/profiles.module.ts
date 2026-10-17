import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { CompaniesModule } from "../companies/companies.module.js";
import { I18nModule } from "../i18n/i18n.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import { SkillsModule } from "../skills/skills.module.js";
import {
  ProfileLinksResolver,
  ProfilesResolver,
  ProjectAchievementsResolver,
  ProjectExperiencesResolver,
  ProjectSkillsResolver,
  WorkAchievementsResolver,
  WorkExperiencesResolver,
  WorkSkillsResolver,
} from "./profiles.resolver.js";
import { ProfilesService } from "./profiles.service.js";

@Module({
  imports: [PrismaModule, I18nModule, CompaniesModule, ProjectsModule, SkillsModule],
  providers: [
    ProfilesResolver,
    ProfilesService,
    ProfileLinksResolver,
    WorkExperiencesResolver,
    WorkSkillsResolver,
    WorkAchievementsResolver,
    ProjectExperiencesResolver,
    ProjectSkillsResolver,
    ProjectAchievementsResolver,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
