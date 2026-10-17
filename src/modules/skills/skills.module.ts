import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { I18nModule } from "../i18n/i18n.module.js";
import { SkillsResolver } from "./skills.resolver.js";
import { SkillsService } from "./skills.service.js";

@Module({
  imports: [PrismaModule, I18nModule],
  providers: [SkillsService, SkillsResolver],
  exports: [SkillsService],
})
export class SkillsModule {}
