import { Test, TestingModule } from "@nestjs/testing";
import { ProfilesResolver } from "./profiles.resolver.js";
import { ProfilesService } from "./profiles.service.js";

describe("ProfilesResolver", () => {
  let resolver: ProfilesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesResolver, ProfilesService],
    }).compile();

    resolver = module.get<ProfilesResolver>(ProfilesResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
