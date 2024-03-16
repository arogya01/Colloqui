import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export const  createUser = async (requestBody : CreateUserInput) => {
    const {password , ...input} = requestBody; 

    const {hash , salt} = hashPassword(password);
   console.log('creating new user', input, hash, salt);

    const user = await prisma.user.create({
        data: {
            Profile:{
                create: {
                    email: input.email, 
                    salt,
                    password: hash,
                    name: input.name,
                    userName: input.userName,
                    bio: input.bio,
                    image: input.image, 
                    phoneNumber : input.phoneNumber
                    
                }
                
            }
          // ...other fields...
        }}); 
}