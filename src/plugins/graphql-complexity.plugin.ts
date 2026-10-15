import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { GraphQLSchemaHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";

const maxComplexity = +(process.env.GRAPHQL_MAX_COMPLEXITY ?? 10000);

@Plugin()
export class GraphQLComplexityPlugin implements ApolloServerPlugin {
  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<void | GraphQLRequestListener<BaseContext>> {
    return {
      didResolveOperation: async ({ request, document }) => {
        if (
          // GRAPHQL_MAX_COMPLEXITY can be set to -1 to turn off complexity analysis
          maxComplexity === -1 ||
          // Skip complexity analysis of introspection queries in development
          // (also, Apollo provides its own thing that limits introspection's depth)
          (process.env.NODE_ENV !== "production" && request.operationName === "IntrospectionQuery")
        ) {
          return;
        }

        const complexity = getComplexity({
          schema: this.gqlSchemaHost.schema,
          context: requestContext,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          maxQueryNodes: 1000,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
        });

        if (complexity > maxComplexity || process.env.NODE_ENV !== "production") {
          // Construct error/debug message
          let msg = `Query "${limit(request.operationName, 50)}"${
            complexity > maxComplexity ? " is too complex" : " complexity"
          }: ${complexity} (max ${maxComplexity}).`;

          if (complexity > maxComplexity) {
            console.warn(msg);
            throw new GraphQLError(msg);
          } else {
            console.debug(msg);
          }
        }
      },
    };
  }
}

function limit(s: string | null | undefined, max_len: number): string {
  return s && s.length > max_len ? s.slice(0, max_len - 1) + "…" : (s ?? "");
}
