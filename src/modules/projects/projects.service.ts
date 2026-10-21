import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Project, ProjectLink } from "./projects.model.js";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async getProjectLinks(project_id: number): Promise<ProjectLink[]> {
    return this.prisma.projectLink
      .findMany({ where: { project_id } })
      .then(links => links.sort((a, b) => a.order - b.order));
  }
}
