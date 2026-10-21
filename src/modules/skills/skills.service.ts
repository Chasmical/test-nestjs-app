import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Skill } from "./skills.model.js";

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where: { id } });
  }
}
