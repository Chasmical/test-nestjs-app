import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ProfilesModule } from "./modules/profiles/profiles.module.js";

const defaultQuery = `query {
  profile(id: 123) {
    id
    full_name
  }
}
`;

@Module({
  imports: [
    ProfilesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: false,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          document: defaultQuery,
        }),
      ],
      autoSchemaFile: join(process.cwd(), "src/@generated/schema.gql"),
      sortSchema: true,
    }),
  ],
})
export class AppModule {}
