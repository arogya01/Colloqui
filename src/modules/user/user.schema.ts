import z from "zod";
import { buildJsonSchemas } from "fastify-zod";


const userCore = {
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email(),
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
    bio : z.string(), 
    phoneNumber: z.string().min(10).max(10), 
    image: z.string(),

});

const loginUserSchema = z.object({
    ...userCore, 
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),
});

const loginRespSchema = z.object({
    accessToken: z.string(),
})

const createUserRespSchema = z.object({
    id : z.string(),
    ...userCore
})


export type CreateUserInput = z.infer<typeof createUserSchema>; 

export const {schemas : userSchemas , $ref} = buildJsonSchemas({
    createUserSchema,
    loginUserSchema, 
    createUserRespSchema, 
    loginRespSchema
})