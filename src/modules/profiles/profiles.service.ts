import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { INCLUDE_I18N } from "../i18n/i18n.service.js";
import { Profile, ProfileLink } from "./profiles.model.js";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { id },
      include: {
        first_name_i18n: INCLUDE_I18N,
        last_name_i18n: INCLUDE_I18N,
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
}
