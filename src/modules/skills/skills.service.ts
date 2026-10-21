import { Injectable } from "@nestjs/common";
import { BatchableService } from "../../prisma/dataloader.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Skill } from "./skills.model.js";

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  skills: BatchableService<number, Skill | null> = {
    createLoader: opt => this.prisma.createLoaderById("skill", opt),
  };

  async findById(id: number): Promise<Skill | null> {
    return this.skills.createLoader({ batch: false }).load(id);
  }
}
