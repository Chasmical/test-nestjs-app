import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import {
  I18nLanguageResolver,
  I18nStringResolver,
  I18nThinStringResolver,
  I18nThinTranslationResolver,
  I18nTranslationResolver,
} from "./i18n.resolvers.js";
import { I18nService } from "./i18n.service.js";

@Module({
  imports: [PrismaModule],
  providers: [
    I18nService,
    I18nLanguageResolver,
    I18nStringResolver,
    I18nThinStringResolver,
    I18nThinTranslationResolver,
    I18nTranslationResolver,
  ],
  exports: [I18nService],
})
export class I18nModule {}
