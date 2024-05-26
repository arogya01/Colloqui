import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

export const createConversationSchema = z
  .object({
    senderId: z.number(),
    message: z.object({
      value: z.string(),
      valueType: z.string(),
    }),
    participants: z.array(z.number()),
    groupName: z.string().optional(),
  })
  .refine(
    (data) => {
      // If participants are more than 2, groupName should not be undefined
      if (data.participants.length > 2) {
        return data.groupName !== undefined;
      }
      // Otherwise, the data is valid
      return true;
    },
    {
      // Custom error message
      message: "groupName is required when there are more than 2 participants",
    }
  );

export const { schemas: chatSchemas, $ref } = buildJsonSchemas({
  createConversationSchema,
});
