import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { CompaniesModule } from "../companies/companies.module.js";
import { I18nModule } from "../i18n/i18n.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import {
  ProfileLinksResolver,
  ProfilesResolver,
  ProjectAchievementsResolver,
  ProjectExperiencesResolver,
  WorkAchievementsResolver,
  WorkExperiencesResolver,
} from "./profiles.resolver.js";
import { ProfilesService } from "./profiles.service.js";

@Module({
  imports: [PrismaModule, I18nModule, CompaniesModule, ProjectsModule],
  providers: [
    ProfilesResolver,
    ProfilesService,
    ProfileLinksResolver,
    WorkExperiencesResolver,
    WorkAchievementsResolver,
    ProjectExperiencesResolver,
    ProjectAchievementsResolver,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
