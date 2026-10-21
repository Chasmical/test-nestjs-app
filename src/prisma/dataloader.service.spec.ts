import { Test, TestingModule } from "@nestjs/testing";
import { DataLoaderService } from "./dataloader.service.js";

describe("DataloaderService", () => {
  let service: DataLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataLoaderService],
    }).compile();

    service = module.get<DataLoaderService>(DataLoaderService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
