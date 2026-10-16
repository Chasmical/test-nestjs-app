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
import { I18nService } from "../i18n/i18n.service.js";
import { Company, CompanyLink } from "./companies.model.js";
import { CompaniesService } from "./companies.service.js";

@Resolver(Company)
export class CompaniesResolver {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Company, { nullable: true })
  async company(@Args("id", { type: () => Int }) id: number): Promise<Company | null> {
    return this.companiesService.findById(id);
  }

  @ResolveField(() => String)
  async name(@Parent() company: Company, @Context() context: GqlExecutionContext): Promise<string> {
    return this.i18n.resolve(company.name_i18n, context);
  }
  @ResolveField(() => [CompanyLink])
  async links(@Parent() company: Company): Promise<CompanyLink[]> {
    return this.companiesService.getCompanyLinks(company.id);
  }
}

@Resolver(CompanyLink)
export class CompanyLinksResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async text(
    @Parent() link: CompanyLink,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(link.text_i18n, context);
  }
}
