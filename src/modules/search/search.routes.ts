import { FastifyInstance } from "fastify";
import { searchUsers } from "./search.controller";
import { $ref, searchSchemas } from "./search.schema";

export default async function searchRoutes(server: FastifyInstance) {

  server.get(
    "/search",
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
