import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { INCLUDE_I18N } from "../i18n/i18n.service.js";
import { Company, CompanyLink } from "./companies.model.js";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        name_i18n: INCLUDE_I18N,
        description_i18n: INCLUDE_I18N,
      },
    });
  }

  async getCompanyLinks(company_id: number): Promise<CompanyLink[]> {
    return this.prisma.companyLink
      .findMany({
        where: { company_id },
        include: { text_i18n: INCLUDE_I18N },
      })
      .then(links => links.sort((a, b) => a.order - b.order));
  }
}
