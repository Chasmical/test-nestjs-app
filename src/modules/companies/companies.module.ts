import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { I18nModule } from "../i18n/i18n.module.js";
import { CompaniesResolver, CompanyLinksResolver } from "./companies.resolver.js";
import { CompaniesService } from "./companies.service.js";

@Module({
  imports: [PrismaModule, I18nModule],
  providers: [CompaniesService, CompaniesResolver, CompanyLinksResolver],
  exports: [CompaniesService],
})
export class CompaniesModule {}
