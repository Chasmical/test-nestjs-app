import { Injectable } from "@nestjs/common";
import { BatchableService } from "../../prisma/dataloader.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Company, CompanyLink } from "./companies.model.js";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  companies: BatchableService<number, Company | null> = {
    createLoader: opt => this.prisma.createLoaderById("company", opt),
  };
  companyLinks: BatchableService<number, CompanyLink[]> = {
    createLoader: opt => this.prisma.createLoaderByRelation("companyLink", "company_id", opt),
  };

  async findById(id: number): Promise<Company | null> {
    return this.companies.createLoader({ batch: false }).load(id);
  }
  async getCompanyLinks(company_id: number): Promise<CompanyLink[]> {
    return this.companyLinks.createLoader({ batch: false }).load(company_id);
  }
}
