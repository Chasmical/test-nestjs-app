import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { I18nModule } from "../i18n/i18n.module.js";
import { ProjectLinksResolver, ProjectsResolver } from "./projects.resolver.js";
import { ProjectsService } from "./projects.service.js";

@Module({
  imports: [PrismaModule, I18nModule],
  providers: [ProjectsService, ProjectsResolver, ProjectLinksResolver],
})
export class ProjectsModule {}
