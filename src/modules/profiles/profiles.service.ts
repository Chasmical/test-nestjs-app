import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { INCLUDE_I18N } from "../i18n/i18n.service.js";
import {
  Profile,
  ProfileLink,
  ProjectAchievement,
  ProjectExperience,
  WorkAchievement,
  WorkExperience,
} from "./profiles.model.js";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { id },
      include: {
        first_name_i18n: INCLUDE_I18N,
        last_name_i18n: INCLUDE_I18N,
        description_i18n: INCLUDE_I18N,
      },
    });
  }

  async getProfileLinks(profile_id: number): Promise<ProfileLink[]> {
    return this.prisma.profileLink
      .findMany({
        where: { profile_id },
        include: { text_i18n: INCLUDE_I18N },
      })
      .then(links => links.sort((a, b) => a.order - b.order));
  }

  async getWorkExperiences(profile_id: number): Promise<WorkExperience[]> {
    return this.prisma.workExperience.findMany({
      where: { profile_id },
      include: { title_i18n: INCLUDE_I18N, description_i18n: INCLUDE_I18N },
    });
  }
  async getWorkAchievements(work_experience_id: number): Promise<WorkAchievement[]> {
    return this.prisma.workAchievement.findMany({
      where: { work_experience_id },
      include: { title_i18n: INCLUDE_I18N, description_i18n: INCLUDE_I18N },
    });
  }

  async getProjectExperiences(profile_id: number): Promise<ProjectExperience[]> {
    return this.prisma.projectExperience.findMany({
      where: { profile_id },
      include: { title_i18n: INCLUDE_I18N, description_i18n: INCLUDE_I18N },
    });
  }
  async getProjectAchievements(project_experience_id: number): Promise<ProjectAchievement[]> {
    return this.prisma.projectAchievement.findMany({
      where: { project_experience_id },
      include: { title_i18n: INCLUDE_I18N, description_i18n: INCLUDE_I18N },
    });
  }
}
