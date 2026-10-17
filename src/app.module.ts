import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { CompaniesModule } from "./modules/companies/companies.module.js";
import { I18nModule } from "./modules/i18n/i18n.module.js";
import { ProfilesModule } from "./modules/profiles/profiles.module.js";
import { ProjectsModule } from "./modules/projects/projects.module.js";
import { GraphQLComplexityPlugin } from "./plugins/graphql-complexity.plugin.js";

const defaultQuery = `query {
  profile(id: 123) {
    full_name description
    links { text url }

    work_experiences {
      company {
        id name description
        links { text url }
      }
      title started_at finished_at
      achievements { description }
    }
    project_experiences {
      project {
        id name description
        links { text url }
      }
      title started_at finished_at
      achievements { description }
    }
  }
}
`;

@Module({
  providers: [GraphQLComplexityPlugin],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: false,
      introspection: true,
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          document: defaultQuery,
          headers: { "Accept-Language": "en-US,en;q=0.9" },
        }),
      ],
      autoSchemaFile: join(process.cwd(), "src/@generated/schema.gql"),
      sortSchema: true,
    }),
    I18nModule,
    ProfilesModule,
    CompaniesModule,
    ProjectsModule,
  ],
})
export class AppModule {}
