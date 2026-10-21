import { Injectable } from "@nestjs/common";
import { BatchableService } from "../../prisma/dataloader.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Project, ProjectLink } from "./projects.model.js";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  projects: BatchableService<number, Project | null> = {
    createLoader: opt => this.prisma.createLoaderById("project", opt),
  };
  projectLinks: BatchableService<number, ProjectLink[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("projectLink", "project_id", opt),
  };

  async findById(id: number): Promise<Project | null> {
    return this.projects.createLoader({ batch: false }).load(id);
  }
  async getProjectLinks(project_id: number): Promise<ProjectLink[]> {
    return this.projectLinks.createLoader({ batch: false }).load(project_id);
  }
}
