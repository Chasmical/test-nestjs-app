import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/@generated/prisma/client.js";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.info("Starting seeding...");

  await prisma.profile.upsert({
    where: { id: 123 },
    update: {},
    create: {
      id: 123,
      first_name: "First",
      last_name: "Last",
    },
  });

  console.info("Seeding completed successfully.");
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
