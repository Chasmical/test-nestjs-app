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
import { I18nString } from "../i18n/i18n.models.js";
import { I18nService } from "../i18n/i18n.service.js";
import { Skill } from "./skills.model.js";
import { SkillsService } from "./skills.service.js";

@Resolver(Skill)
export class SkillsResolver {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly i18n: I18nService,
  ) {}

  @Query(() => Skill, { nullable: true })
  async skill(@Args("id", { type: () => Int }) id: number): Promise<Skill | null> {
    return this.skillsService.findById(id);
  }

  @ResolveField(() => I18nString)
  async name_i18n(@Parent() skill: Skill): Promise<I18nString> {
    return (await this.i18n.findStringById(skill.name_id))!;
  }

  @ResolveField(() => String)
  async name(
    @Parent() skill: Skill,
    @Args("lang", { type: () => String, nullable: true }) lang: string | undefined,
    @Context() context: GqlExecutionContext,
  ): Promise<string> {
    return this.i18n.resolve(skill.name_id, lang ?? context);
  }
}
