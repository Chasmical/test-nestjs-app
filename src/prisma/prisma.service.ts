import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "prisma/config";
import { PrismaClient } from "../@generated/prisma/client.js";
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: env("DATABASE_URL"),
    });
    super({ adapter });
  }
}
