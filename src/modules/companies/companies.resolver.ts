import {
  Args,
  Context,
  GqlExecutionContext,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { DataLoaderService } from "../../prisma/dataloader.service.js";
import { I18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Company, CompanyLink } from "./companies.model.js";
import { CompaniesService } from "./companies.service.js";

@Resolver(Company)
export class CompaniesResolver {
  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly companiesService: CompaniesService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Company, { nullable: true })
  async company(@Args("id", { type: () => Int }) id: number): Promise<Company | null> {
    return this.dataLoader.findById(this.companiesService.companies, id);
  }

  @ResolveField(() => I18nString)
  async name_i18n(@Parent() company: Company): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, company.name_id))!;
  }
  @ResolveField(() => I18nString)
  async description_i18n(@Parent() company: Company): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, company.description_id))!;
  }

  @ResolveField(() => String)
  async name(
    @Parent() company: Company,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, company.name_id, lang ?? context);
  }
  @ResolveField(() => String)
  async description(
    @Parent() company: Company,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, company.description_id, lang ?? context);
  }

  @ResolveField(() => [CompanyLink])
  async links(@Parent() company: Company): Promise<CompanyLink[]> {
    return this.dataLoader.findById(this.companiesService.companyLinks, company.id);
  }
}

@Resolver(CompanyLink)
export class CompanyLinksResolver {
  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => I18nString)
  async text_i18n(@Parent() link: CompanyLink): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, link.text_id))!;
  }

  @ResolveField(() => String)
  async text(
    @Parent() link: CompanyLink,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, link.text_id, lang ?? context);
  }
}
