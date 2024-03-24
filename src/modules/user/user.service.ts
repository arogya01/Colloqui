import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export const  createUser = async (requestBody : CreateUserInput) => {
    const {password , ...input} = requestBody; 

    console.log('creating new user', input);
    const {hash , salt} = await hashPassword(password);
    console.log('hash', hash);
    console.log('salt',salt);
    const user = await prisma.user.create({
        data: {
            Profile:{
                create: {
                    email: input.email, 
                    salt,
                    password: hash,
                    userName: input.userName,
                    bio: input.bio,
                    image: input.image, 
                    phoneNumber : input.phoneNumber
                    
                }
                
            }
          // ...other fields...
        }}); 

        return user; 
}

export const verifyPassword = async () => {
   
}

export const checkExistingUser = async (email : string) => {

    console.log('check for existing user'); 

    const existingUser = await prisma.user.findUnique({
      where : {
        email : email
      }
    });


    return existingUser; 

}