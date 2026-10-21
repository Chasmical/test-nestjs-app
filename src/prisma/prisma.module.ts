import { Module } from "@nestjs/common";
import { DataLoaderService } from "./dataloader.service.js";
import { PrismaService } from "./prisma.service.js";

@Module({
  providers: [PrismaService, DataLoaderService],
  exports: [PrismaService, DataLoaderService],
})
export class PrismaModule {}
