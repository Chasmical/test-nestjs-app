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

  // ========== Add profile info ==========

  let first_name_id = await i18nString(101, [
    { lang: enUs, translation: "Name" },
    { lang: ru, translation: "Имя" },
  ]);
  let last_name_id = await i18nString(102, [
    { lang: enUs, translation: "Surname" },
    { lang: ru, translation: "Фамилия" },
  ]);
  let description_id = await i18nString(103, [
    { lang: enUs, translation: "Description" },
    { lang: ru, translation: "Описание" },
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

  // TODO ========== Add the rest ==========

  console.timeEnd("Seeding");
}

type UpsertArgs<T> = { where: { id: number }; update: Omit<T, "id">; create: T };

async function upsert<
  T extends { id: number },
  M extends { upsert: (args: UpsertArgs<T>) => Promise<T> },
>(model: M, value: T) {
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
