import { FastifyInstance } from "fastify";
import { searchUsers } from "./search.controller";
import { $ref, searchSchemas } from "./search.schema";

export default async function searchRoutes(server: FastifyInstance) {
  for (const schema of searchSchemas) {
    server.addSchema(schema);
  }

  server.get(
    "api/users/search",
    {
      schema: {
        querystring: $ref("searchQuerySchema"),
        response: {
          200: $ref("searchResponseSchema"),
        },
      },
    },
    searchUsers
  );
}
