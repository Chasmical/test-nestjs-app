import { Injectable } from "@nestjs/common";
import { BatchableService } from "../../prisma/dataloader.service.js";
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

  profiles: BatchableService<number, Profile | null> = {
    createLoader: opt => this.prisma.createLoaderById("profile", opt),
  };
  profileLinks: BatchableService<number, ProfileLink[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("profileLink", "profile_id", opt),
  };
  workExperiencesByProfile: BatchableService<number, WorkExperience[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("workExperience", "profile_id", opt),
  };
  projectExperiencesByProfile: BatchableService<number, ProjectExperience[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("projectExperience", "profile_id", opt),
  };

  workExperiences: BatchableService<number, WorkExperience | null> = {
    createLoader: opt => this.prisma.createLoaderById("workExperience", opt),
  };
  projectExperiences: BatchableService<number, ProjectExperience | null> = {
    createLoader: opt => this.prisma.createLoaderById("projectExperience", opt),
  };

  workSkills: BatchableService<number, WorkSkill[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("workSkill", "work_experience_id", opt),
  };
  projectSkills: BatchableService<number, ProjectSkill[]> = {
    createLoader: opt =>
      this.prisma.createLoaderByRelation("projectSkill", "project_experience_id", opt),
  };

  workAchievements: BatchableService<number, WorkAchievement[]> = {
    createLoader: opt =>
      this.prisma.createLoaderByRelation("workAchievement", "work_experience_id", opt),
  };
  projectAchievements: BatchableService<number, ProjectAchievement[]> = {
    createLoader: opt =>
      this.prisma.createLoaderByRelation("projectAchievement", "project_experience_id", opt),
  };

  async findProfileById(id: number): Promise<Profile | null> {
    return this.profiles.createLoader({ batch: false }).load(id);
  }
  async findWorkExperienceById(id: number): Promise<WorkExperience | null> {
    return this.workExperiences.createLoader({ batch: false }).load(id);
  }
  async findProjectExperienceById(id: number): Promise<ProjectExperience | null> {
    return this.projectExperiences.createLoader({ batch: false }).load(id);
  }

  async getProfileLinks(profile_id: number): Promise<ProfileLink[]> {
    return this.profileLinks.createLoader({ batch: false }).load(profile_id);
  }
  async getWorkExperiences(profile_id: number): Promise<WorkExperience[]> {
    return this.workExperiencesByProfile.createLoader({ batch: false }).load(profile_id);
  }
  async getProjectExperiences(profile_id: number): Promise<ProjectExperience[]> {
    return this.projectExperiencesByProfile.createLoader({ batch: false }).load(profile_id);
  }

  async getWorkSkills(work_experience_id: number): Promise<WorkSkill[]> {
    return this.workSkills.createLoader({ batch: false }).load(work_experience_id);
  }
  async getProjectSkills(project_experience_id: number): Promise<ProjectSkill[]> {
    return this.projectSkills.createLoader({ batch: false }).load(project_experience_id);
  }

  async getWorkAchievements(work_experience_id: number): Promise<WorkAchievement[]> {
    return this.workAchievements.createLoader({ batch: false }).load(work_experience_id);
  }
  async getProjectAchievements(project_experience_id: number): Promise<ProjectAchievement[]> {
    return this.projectAchievements.createLoader({ batch: false }).load(project_experience_id);
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
}
