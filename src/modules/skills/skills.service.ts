import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { INCLUDE_I18N } from "../i18n/i18n.service.js";
import { Skill } from "./skills.model.js";

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Skill | null> {
    return this.prisma.skill.findUnique({
      where: { id },
      include: { name_i18n: INCLUDE_I18N },
    });
  }
}
