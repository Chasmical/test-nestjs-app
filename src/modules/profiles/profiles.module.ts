import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { ProfilesResolver } from "./profiles.resolver.js";
import { ProfilesService } from "./profiles.service.js";

@Module({
  providers: [ProfilesResolver, ProfilesService],
  imports: [PrismaModule],
})
export class ProfilesModule {}
