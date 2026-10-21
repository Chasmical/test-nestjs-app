import { Injectable, Scope } from "@nestjs/common";
import DataLoader from "dataloader";

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderService {
  private loaders = new Map<unknown, unknown>();

  getLoader<T extends BatchableService<any, any>>(service: T): GetLoaderOf<T> {
    let existing = this.loaders.get(service);
    if (!existing) {
      this.loaders.set(service, (existing = service.createLoader()));
    }
    return existing as GetLoaderOf<T>;
  }

  findById<T extends BatchableService<any, any>>(service: T, id: number): GetModelOf<T> {
    return this.getLoader(service).load(id) as GetModelOf<T>;
  }
}

export interface BatchableService<K, V> {
  createLoader(opt?: DataLoader.Options<K, V>): DataLoader<K, V>;
}

type GetLoaderOf<T extends BatchableService<any, any>> = ReturnType<T["createLoader"]>;
type GetModelOf<T extends BatchableService<any, any>> = ReturnType<GetLoaderOf<T>["load"]>;
