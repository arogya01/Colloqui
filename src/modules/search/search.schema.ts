import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const searchQuerySchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

const searchResponseSchema = z.array(
  z.object({
    id: z.number(),
    Profile: z.object({
      userName: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      bio: z.string().nullable(),
      image: z.string().nullable(),
    }),
  })
);

export const { schemas: searchSchemas, $ref  } = buildJsonSchemas({
  
  searchQuerySchema,
  searchResponseSchema,
},{
  $id: "searchSchema",
});
