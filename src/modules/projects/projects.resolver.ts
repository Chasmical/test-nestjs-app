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
import { Project, ProjectLink } from "./projects.model.js";
import { ProjectsService } from "./projects.service.js";

@Resolver(Project)
export class ProjectsResolver {
  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly projectsService: ProjectsService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Project, { nullable: true })
  async project(@Args("id", { type: () => Int }) id: number): Promise<Project | null> {
    return this.dataLoader.findById(this.projectsService.projects, id);
  }

  @ResolveField(() => I18nString)
  async name_i18n(@Parent() project: Project): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, project.name_id))!;
  }
  @ResolveField(() => I18nString)
  async description_i18n(@Parent() project: Project): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, project.description_id))!;
  }

  @ResolveField(() => String)
  async name(
    @Parent() project: Project,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, project.name_id, lang ?? context);
  }
  @ResolveField(() => String)
  async description(
    @Parent() project: Project,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, project.description_id, lang ?? context);
  }

  @ResolveField(() => [ProjectLink])
  async links(@Parent() project: Project): Promise<ProjectLink[]> {
    return this.dataLoader.findById(this.projectsService.projectLinks, project.id);
  }
}

@Resolver(ProjectLink)
export class ProjectLinksResolver {
  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly i18n: I18nService,
  ) {}

  @ResolveField(() => I18nString)
  async text_i18n(@Parent() link: ProjectLink): Promise<I18nString> {
    return (await this.dataLoader.findById(this.i18n.strings, link.text_id))!;
  }

  @ResolveField(() => String)
  async text(
    @Parent() link: ProjectLink,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.dataLoader.resolve(this.i18n, link.text_id, lang ?? context);
  }
}
