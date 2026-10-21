import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import DataLoader from "dataloader";
import { env } from "prisma/config";
import { PrismaClient } from "../@generated/prisma/client.js";
import { GlobalOmitConfig } from "../@generated/prisma/internal/prismaNamespace.js";
import "dotenv/config";

type Schema = GlobalOmitConfig;

type ModelName = keyof Schema;
type Model<K extends ModelName> = NonNullable<Awaited<ReturnType<PrismaClient[K]["findFirst"]>>>;

type ModelsWithId = {
  [K in ModelName as Model<K> extends { id?: any } ? K : never]: Model<K>;
};
type ModelNameWithId = keyof ModelsWithId;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: env("DATABASE_URL"),
    });
    super({ adapter });
  }

  createLoaderById<K extends ModelNameWithId>(
    key: K,
    opt?: DataLoader.Options<Model<K>["id"], Model<K> | null>,
  ): DataLoader<number, Model<K> | null> {
    return this.createLoaderByUniqueField(key, "id", opt);
  }

  createLoaderByUniqueField<K extends ModelName, F extends keyof Model<K>>(
    key: K,
    field: F,
    opt?: DataLoader.Options<Model<K>[F], Model<K> | null>,
  ): DataLoader<Model<K>[F], Model<K> | null> {
    return new DataLoader(async (keys: readonly Model<K>[F][]) => {
      let results: any[] = await (this[key] as any).findMany({ where: { [field]: { in: keys } } });
      return keys.map(key => results.find(res => res[field] === key) ?? null);
    }, opt);
  }
  createLoaderByRelation<K extends ModelName, F extends keyof Model<K>>(
    key: K,
    field: F,
    opt?: DataLoader.Options<Model<K>[F], Model<K>[]>,
  ): DataLoader<Model<K>[F], Model<K>[]> {
    return new DataLoader(async (keys: readonly Model<K>[F][]) => {
      let results: any[] = await (this[key] as any).findMany({ where: { [field]: { in: keys } } });
      return keys.map(key => results.filter(res => res[field] === key));
    }, opt);
  }
}
