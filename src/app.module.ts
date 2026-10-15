import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { I18nModule } from "./modules/i18n/i18n.module.js";
import { ProfilesModule } from "./modules/profiles/profiles.module.js";
import { GraphQLComplexityPlugin } from "./plugins/graphql-complexity.plugin.js";

const defaultQuery = `query {
  profile(id: 123) {
    id

    # Try changing "Accept-Language" header to "ru" or "en" to see these fields change
    first_name last_name full_name

    full_name_i18n {
      translations {
        language { name }
        value
      }
    }
  }
  languages {
    ietf_tag english_name local_name
  }
}
`;

@Module({
  providers: [GraphQLComplexityPlugin],
  imports: [
    I18nModule,
    ProfilesModule,
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
  ],
})
export class AppModule {}
