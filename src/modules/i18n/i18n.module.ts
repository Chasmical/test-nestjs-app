import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import {
  I18nAnonTranslationResolver,
  I18nLanguageResolver,
  I18nStringResolver,
  I18nTranslationResolver,
} from "./i18n.resolvers.js";
import { I18nService } from "./i18n.service.js";

@Module({
  imports: [PrismaModule],
  providers: [
    I18nService,
    I18nLanguageResolver,
    I18nStringResolver,
    I18nTranslationResolver,
    I18nAnonTranslationResolver,
  ],
  exports: [I18nService],
})
export class I18nModule {}
