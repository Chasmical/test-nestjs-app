import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/@generated/prisma/client.js";
import "dotenv/config";
/* oxlint-disable no-unused-vars */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.time("Seeding");

  // ========== Add languages ==========

  await i18nString(1, []);
  await i18nString(2, []);

  let { id: enUs } = await upsert(prisma.language, { id: 1, ietf_tag: "en-US", name_id: 1 });
  let { id: ru } = await upsert(prisma.language, { id: 2, ietf_tag: "ru", name_id: 2 });

  await i18nString(1, [
    { lang: enUs, translation: "English" },
    { lang: ru, translation: "Английский" },
  ]);
  await i18nString(2, [
    { lang: enUs, translation: "Russian" },
    { lang: ru, translation: "Русский" },
  ]);

  // ========== Add skills ==========

  let name_id = await i18nString(21, [{ lang: enUs, translation: "C#" }]);
  let { id: csharpId } = await upsert(prisma.skill, { id: 1, name_id });

  name_id = await i18nString(22, [{ lang: enUs, translation: ".NET" }]);
  let { id: dotnetId } = await upsert(prisma.skill, { id: 2, name_id });

  name_id = await i18nString(23, [{ lang: enUs, translation: "Unity" }]);
  let { id: unityId } = await upsert(prisma.skill, { id: 3, name_id });

  name_id = await i18nString(24, [{ lang: enUs, translation: "JavaScript/TypeScript" }]);
  let { id: jsTsId } = await upsert(prisma.skill, { id: 4, name_id });

  name_id = await i18nString(25, [{ lang: enUs, translation: "Rust" }]);
  let { id: rustId } = await upsert(prisma.skill, { id: 5, name_id });

  name_id = await i18nString(26, [{ lang: enUs, translation: "Angular" }]);
  let { id: angularId } = await upsert(prisma.skill, { id: 6, name_id });

  name_id = await i18nString(27, [{ lang: enUs, translation: "Next.js" }]);
  let { id: nextJsId } = await upsert(prisma.skill, { id: 7, name_id });

  name_id = await i18nString(28, [{ lang: enUs, translation: "React" }]);
  let { id: reactId } = await upsert(prisma.skill, { id: 8, name_id });

  name_id = await i18nString(29, [{ lang: enUs, translation: "HTML/CSS" }]);
  let { id: htmlCssId } = await upsert(prisma.skill, { id: 9, name_id });

  // ========== Add profile info ==========

  let first_name_id = await i18nString(101, [
    { lang: enUs, translation: "Denis" },
    { lang: ru, translation: "Денис" },
  ]);
  let last_name_id = await i18nString(102, [
    { lang: enUs, translation: "Filippov" },
    { lang: ru, translation: "Филиппов" },
  ]);
  // oxfmt-ignore
  let description_id = await i18nString(103, [
    { lang: enUs, translation: "Full-stack software developer with experience working in TypeScript, C# and Rust, and making applications on Angular and Next.js." },
    { lang: ru, translation: "Fullstack-разработчик с опытом работы с TypeScript, C# и Rust, а также создания приложений на Angular и Next.js." },
  ]);

  let { id: profile_id } = await upsert(prisma.profile, {
    id: 123,
    first_name_id,
    last_name_id,
    description_id,
  });

  let text_id = await i18nString(104, [{ lang: enUs, translation: "GitHub" }]);
  let url = "https://github.com/Chasmical";
  await upsert(prisma.profileLink, { id: 1, profile_id, order: 0, text_id, url });

  text_id = await i18nString(105, [{ lang: enUs, translation: "Discord" }]);
  url = "https://discord.com/users/511178002277597185";
  await upsert(prisma.profileLink, { id: 2, profile_id, order: 1, text_id, url });

  // ========== Add company info ==========

  name_id = await i18nString(201, [
    { lang: enUs, translation: "RIT Automation LLC" },
    { lang: ru, translation: 'ООО "РИТ Автомейшен"' },
  ]);
  // oxfmt-ignore
  description_id = await i18nString(202, [
    { lang: enUs, translation: "Software development company specializing in solutions for automating the operation of mining enterprises since 2011." },
    { lang: ru, translation: "Компания-разработчик программного обеспечения, специализирующаяся на решениях для автоматизации работы горнодобывающих предприятий с 2011 года." },
  ]);
  let { id: company_id } = await upsert(prisma.company, { id: 1, name_id, description_id });

  text_id = await i18nString(203, [
    { lang: enUs, translation: "Website" },
    { lang: ru, translation: "Сайт" },
  ]);
  url = "https://rit-it.com";
  await upsert(prisma.companyLink, { id: 1, company_id, order: 0, text_id, url });

  // ========== Add work experience ==========

  // oxfmt-ignore
  let title_id = await i18nString(251, [
    { lang: enUs, translation: "Junior software developer, 1 rank (category)" },
    { lang: ru, translation: "Младший разработчик программного обеспечения, 1 разряд (категория)" },
  ]);

  // oxfmt-ignore
  let { id: work_experience_id } = await upsert(prisma.workExperience, {
    id: 1, profile_id, company_id, title_id,
    started_at: "2022-07-01T00:00:00Z", finished_at: "2024-06-01T00:00:00Z",
  });

  for (const skill_id of [angularId, jsTsId, htmlCssId]) {
    await prisma.workSkill.upsert({
      where: { work_experience_id_skill_id: { work_experience_id, skill_id } },
      update: {},
      create: { work_experience_id, skill_id },
    });
  }

  // oxfmt-ignore
  description_id = await i18nString(253, [
    { lang: enUs, translation: "Developed and maintained the web interface of a mining equipment and operations management system, with drag-and-drop lists, editable tables, interactive charts and maps." },
    { lang: ru, translation: "Разрабатывал и поддерживал веб-интерфейс системы управления горнотранспортным комплексом, со списками с перетаскиванием, редактируемыми таблицами, интерактивными графиками и картами." },
  ]);
  await upsert(prisma.workAchievement, { id: 1, work_experience_id, description_id });

  // oxfmt-ignore
  description_id = await i18nString(254, [
    { lang: enUs, translation: "Optimized and renovated the code base, and facilitated the team's transition to more efficient APIs, reducing the amount of duplicate code and improving page load/response times." },
    { lang: ru, translation: "Оптимизировал и обновил кодовую базу, и облегчил переход команды на более эффективные API, сократив количество дублированного кода и улучшив время загрузки/ответа страниц." },
  ]);
  await upsert(prisma.workAchievement, { id: 2, work_experience_id, description_id });

  // ========== Add project info (RogueLibs) ==========

  name_id = await i18nString(301, [{ lang: enUs, translation: "RogueLibs" }]);
  description_id = await i18nString(302, [
    { lang: enUs, translation: "Modding library for Streets of Rogue" },
    { lang: ru, translation: "Моддинговая библиотека для Streets of Rogue" },
  ]);
  let project_id = (await upsert(prisma.project, { id: 1, name_id, description_id })).id;

  text_id = await i18nString(303, [{ lang: enUs, translation: "GitHub" }]);
  url = "https://github.com/Chasmical/RogueLibs";
  await upsert(prisma.projectLink, { id: 1, project_id, order: 0, text_id, url });

  text_id = await i18nString(304, [
    { lang: enUs, translation: "Website" },
    { lang: ru, translation: "Сайт" },
  ]);
  url = "https://chasmical.github.io/RogueLibs/";
  await upsert(prisma.projectLink, { id: 2, project_id, order: 0, text_id, url });

  // oxfmt-ignore
  let { id: project_experience_id } = await upsert(prisma.projectExperience, {
    id: 1, profile_id, project_id,
    started_at: "2020-05-01T00:00:00Z", finished_at: "2024-02-01T00:00:00Z",
  });

  for (const skill_id of [csharpId, dotnetId, unityId, reactId]) {
    await prisma.projectSkill.upsert({
      where: { project_experience_id_skill_id: { project_experience_id, skill_id } },
      update: {},
      create: { project_experience_id, skill_id },
    });
  }

  // oxfmt-ignore
  description_id = await i18nString(352, [
    { lang: enUs, translation: "Designed and implemented an extensive and easy to use modding API for the game." },
    { lang: ru, translation: "Разработал и реализовал обширный и простой в использовании API для моддинга игры." },
  ]);
  await upsert(prisma.projectAchievement, { id: 1, project_experience_id, description_id });

  // oxfmt-ignore
  description_id = await i18nString(353, [
    { lang: enUs, translation: "Developed innovative mods and plugins, pioneering modding in the game's community." },
    { lang: ru, translation: "Разработал инновационные моды и плагины, способствуя популяризации моддинга в комьюнити игры." },
  ]);
  await upsert(prisma.projectAchievement, { id: 2, project_experience_id, description_id });

  // ========== Add project info (Chasm.SemanticVersioning) ==========

  name_id = await i18nString(401, [{ lang: enUs, translation: "Chasm.SemanticVersioning" }]);
  description_id = await i18nString(402, [
    { lang: enUs, translation: "All-purpose semantic versioning library" },
    { lang: ru, translation: "Библиотека семантического версионирования" },
  ]);
  project_id = (await upsert(prisma.project, { id: 2, name_id, description_id })).id;

  text_id = await i18nString(403, [{ lang: enUs, translation: "GitHub" }]);
  url = "https://github.com/Chasmical/Chasm";
  await upsert(prisma.projectLink, { id: 101, project_id, order: 0, text_id, url });

  // oxfmt-ignore
  project_experience_id = (await upsert(prisma.projectExperience, {
    id: 2, profile_id, project_id,
    started_at: "2023-03-01T00:00:00Z", finished_at: null,
  })).id;

  for (const skill_id of [csharpId, dotnetId]) {
    await prisma.projectSkill.upsert({
      where: { project_experience_id_skill_id: { project_experience_id, skill_id } },
      update: {},
      create: { project_experience_id, skill_id },
    });
  }

  // oxfmt-ignore
  description_id = await i18nString(452, [
    { lang: enUs, translation: "Implemented high-performance, spec-compliant parsing and formatting of semantic versions and ranges, several times more performant and efficient than of any alternatives." },
    { lang: ru, translation: "Реализовал высокопроизводительные парсинг и форматирование семантических версий и диапазонов, в несколько раз производительнее и эффективнее любых альтернатив." },
  ]);
  await upsert(prisma.projectAchievement, { id: 101, project_experience_id, description_id });

  // ========== Add project info (zaliznyak-rs) ==========

  name_id = await i18nString(501, [{ lang: enUs, translation: "zaliznyak-rs" }]);
  description_id = await i18nString(502, [
    { lang: enUs, translation: "A Russian grammar and inflection library" },
    { lang: ru, translation: "Библиотека русской грамматики и склонений" },
  ]);
  project_id = (await upsert(prisma.project, { id: 3, name_id, description_id })).id;

  text_id = await i18nString(503, [{ lang: enUs, translation: "GitHub" }]);
  url = "https://github.com/Chasmical/zaliznyak-rs";
  await upsert(prisma.projectLink, { id: 201, project_id, order: 0, text_id, url });

  // oxfmt-ignore
  project_experience_id = (await upsert(prisma.projectExperience, {
    id: 3, profile_id, project_id,
    started_at: "2024-11-01T00:00:00Z", finished_at: null,
  })).id;

  for (const skill_id of [rustId, csharpId]) {
    await prisma.projectSkill.upsert({
      where: { project_experience_id_skill_id: { project_experience_id, skill_id } },
      update: {},
      create: { project_experience_id, skill_id },
    });
  }

  // oxfmt-ignore
  description_id = await i18nString(552, [
    { lang: enUs, translation: "Developed an API based on A.A. Zaliznyak's Russian inflection classification system." },
    { lang: ru, translation: "Разработал API для классификации русских склонений по системе А.А. Зализняка." },
  ]);
  await upsert(prisma.projectAchievement, { id: 201, project_experience_id, description_id });

  // ========== Add project info (ttf-view) ==========

  name_id = await i18nString(601, [{ lang: enUs, translation: "ttf-view" }]);
  // oxfmt-ignore
  description_id = await i18nString(602, [
    { lang: enUs, translation: "A TrueType/OpenType font parsing/viewing library and a CLI tool." },
    { lang: ru, translation: "Библиотека и CLI инструмент для парсинга/просмотра TrueType/OpenType шрифтов." },
  ]);
  project_id = (await upsert(prisma.project, { id: 4, name_id, description_id })).id;

  text_id = await i18nString(603, [{ lang: enUs, translation: "GitHub" }]);
  url = "https://github.com/Chasmical/ttf-view";
  await upsert(prisma.projectLink, { id: 301, project_id, order: 0, text_id, url });

  // oxfmt-ignore
  project_experience_id = (await upsert(prisma.projectExperience, {
    id: 4, profile_id, project_id,
    started_at: "2026-08-01T00:00:00Z", finished_at: null,
  })).id;

  for (const skill_id of [rustId]) {
    await prisma.projectSkill.upsert({
      where: { project_experience_id_skill_id: { project_experience_id, skill_id } },
      update: {},
      create: { project_experience_id, skill_id },
    });
  }

  // oxfmt-ignore
  description_id = await i18nString(652, [
    { lang: enUs, translation: "Currently developing a zero-copy TrueType/OpenType font parsing/viewing Rust library." },
    { lang: ru, translation: "Разрабатываю zero-copy Rust библиотеку для парсинга/просмотра TrueType/OpenType шрифтов." },
  ]);
  await upsert(prisma.projectAchievement, { id: 301, project_experience_id, description_id });

  console.timeEnd("Seeding");
}

type UpsertArgs<T> = { where: { id: number }; update: Omit<T, "id">; create: T };

async function upsert<
  T extends { id: number },
  M extends { upsert: (args: UpsertArgs<T>) => Promise<any> },
>(model: M, value: T): Promise<Awaited<ReturnType<M["upsert"]>>> {
  return model.upsert({
    where: { id: value.id },
    update: { ...value, id: undefined },
    create: value,
  });
}

async function i18nString(
  string_id: number,
  translations: { lang: number; translation: string }[],
): Promise<number> {
  let { id } = await prisma.i18nString.upsert({
    where: { id: string_id },
    update: {},
    create: { id: string_id },
  });

  for (const { lang: language_id, translation: value } of translations) {
    await prisma.translation.upsert({
      where: { string_id_language_id: { language_id, string_id } },
      update: { value },
      create: { string_id, language_id, value },
    });
  }

  return id;
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
