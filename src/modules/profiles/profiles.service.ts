import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Skill } from "../skills/skills.model.js";
import {
  Profile,
  ProfileLink,
  ProjectAchievement,
  ProjectExperience,
  ProjectSkill,
  WorkAchievement,
  WorkExperience,
  WorkSkill,
} from "./profiles.model.js";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }
  async findWorkExperienceById(id: number): Promise<WorkExperience | null> {
    return this.prisma.workExperience.findUnique({ where: { id } });
  }
  async findProjectExperienceById(id: number): Promise<ProjectExperience | null> {
    return this.prisma.projectExperience.findUnique({ where: { id } });
  }

  async getProfileLinks(profile_id: number): Promise<ProfileLink[]> {
    return this.prisma.profileLink
      .findMany({ where: { profile_id } })
      .then(links => links.sort((a, b) => a.order - b.order));
  }
  async getProfileSkills(profile_id: number): Promise<Skill[]> {
    let data = await this.prisma.profile.findUnique({
      where: { id: profile_id },
      select: {
        work_experiences: {
          select: { skills: { select: { skill: true } } },
        },
        project_experiences: {
          select: { skills: { select: { skill: true } } },
        },
      },
    });
    if (!data) {
      return [];
    }

    // Return all unique skills from work and project experiences
    return data.work_experiences
      .concat(data.project_experiences)
      .flatMap(exp => exp.skills.map(sk => sk.skill))
      .filter((skill, i, arr) => i === arr.findIndex(other => other.id === skill.id));
  }

  async getWorkExperiences(profile_id: number): Promise<WorkExperience[]> {
    return this.prisma.workExperience.findMany({ where: { profile_id } });
  }
  async getWorkSkills(work_experience_id: number): Promise<WorkSkill[]> {
    return this.prisma.workSkill.findMany({ where: { work_experience_id } });
  }
  async getWorkAchievements(work_experience_id: number): Promise<WorkAchievement[]> {
    return this.prisma.workAchievement.findMany({ where: { work_experience_id } });
  }

  async getProjectExperiences(profile_id: number): Promise<ProjectExperience[]> {
    return this.prisma.projectExperience.findMany({ where: { profile_id } });
  }
  async getProjectSkills(project_experience_id: number): Promise<ProjectSkill[]> {
    return this.prisma.projectSkill.findMany({ where: { project_experience_id } });
  }
  async getProjectAchievements(project_experience_id: number): Promise<ProjectAchievement[]> {
    return this.prisma.projectAchievement.findMany({ where: { project_experience_id } });
  }
}
