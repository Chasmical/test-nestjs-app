import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { INCLUDE_I18N } from "../i18n/i18n.service.js";
import { Project, ProjectLink } from "./projects.model.js";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        name_i18n: INCLUDE_I18N,
      },
    });
  }

  async getProjectLinks(project_id: number): Promise<ProjectLink[]> {
    return this.prisma.projectLink
      .findMany({
        where: { project_id },
        include: { text_i18n: INCLUDE_I18N },
      })
      .then(links => links.sort((a, b) => a.order - b.order));
  }
}
