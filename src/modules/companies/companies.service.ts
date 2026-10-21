import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Company, CompanyLink } from "./companies.model.js";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async getCompanyLinks(company_id: number): Promise<CompanyLink[]> {
    return this.prisma.companyLink
      .findMany({ where: { company_id } })
      .then(links => links.sort((a, b) => a.order - b.order));
  }
}
