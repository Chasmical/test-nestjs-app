import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/@generated/prisma/client.js";
import "dotenv/config";
/* oxlint-disable no-unused-vars */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.time("Seeding");

  await i18nString(1, []);
  await i18nString(2, []);

  let { id: enUs } = await prisma.language.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      two_char_code: "en",
      three_char_code: "eng",
      ietf_tag: "en-US",
      name_id: 1,
    },
  });
  let { id: ru } = await prisma.language.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      two_char_code: "ru",
      three_char_code: "rus",
      ietf_tag: "ru",
      name_id: 2,
    },
  });

  await i18nString(1, [
    { id: 1, lang: enUs, translation: "English" },
    { id: 2, lang: ru, translation: "Английский" },
  ]);
  await i18nString(2, [
    { id: 3, lang: enUs, translation: "Russian" },
    { id: 4, lang: ru, translation: "Русский" },
  ]);

  let { id: first_name_id } = await i18nString(101, [
    { id: 101, lang: enUs, translation: "Name" },
    { id: 102, lang: ru, translation: "Имя" },
  ]);
  let { id: last_name_id } = await i18nString(102, [
    { id: 103, lang: enUs, translation: "Surname" },
    { id: 104, lang: ru, translation: "Фамилия" },
  ]);

  await prisma.profile.upsert({
    where: { id: 123 },
    update: {},
    create: {
      id: 123,
      first_name_id,
      last_name_id,
    },
  });

  console.timeEnd("Seeding");
}

async function i18nString(
  string_id: number,
  translations: { id: number; lang: number; translation: string }[],
) {
  let ret = await prisma.i18nString.upsert({
    where: { id: string_id },
    update: {},
    create: { id: string_id },
  });

  for (const { id, lang: language_id, translation: value } of translations) {
    await prisma.translation.upsert({
      where: { string_id_language_id: { language_id, string_id } },
      update: { value },
      create: { string_id, language_id, value },
    });
  }

  return ret;
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
