import z from "zod";
import { buildJsonSchemas } from "fastify-zod";


const userCore = {
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email(), // Email validation

    userId: z.string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string",
    }),    
}

const createUserSchema = z.object({
    ...userCore, 
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(8), // Password validation,
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>; 

export const {schemas : userSchemas , $ref} = buildJsonSchemas({
    createUserSchema,
})