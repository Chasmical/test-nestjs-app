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
import { Project, ProjectLink } from "./projects.model.js";
import { ProjectsService } from "./projects.service.js";

@Resolver(Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Project, { nullable: true })
  async project(@Args("id", { type: () => Int }) id: number): Promise<Project | null> {
    return this.projectsService.findById(id);
  }

  @ResolveField(() => String)
  async name(
    @Parent() project: Project,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(project.name_i18n, lang ?? context);
  }
  @ResolveField(() => [ProjectLink])
  async links(@Parent() project: Project): Promise<ProjectLink[]> {
    return this.projectsService.getProjectLinks(project.id);
  }
}

@Resolver(ProjectLink)
export class ProjectLinksResolver {
  constructor(private readonly i18n: I18nService) {}

  @ResolveField(() => String)
  async text(
    @Parent() link: ProjectLink,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(link.text_i18n, lang ?? context);
  }
}
