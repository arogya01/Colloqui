import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export const createUser = async (requestBody: CreateUserInput) => {
  const { password, ...input } = requestBody;

  console.log("creating new user", input);
  const { hash, salt } = await hashPassword(password);
  console.log("hash", hash);
  console.log("salt", salt);

  try {
    const user = await prisma.user.create({
      data: {
        Profile: {
          create: {
            email: input.email,
            salt,
            password: hash,
            userName: input.userName,
            bio: input.bio,
            image: input.image,
            phoneNumber: input.phoneNumber,
          },
        },
      },
    });
    console.log("user is", user);

    return user;
  } catch (error) {
    console.log("error occured in signup service handler", error);
    throw error;
  }
};

export const verifyPassword = async () => {};

export const fetchUserByEmail = async (email:string) => {
  console.log('fetching user by id', email);
  const userProfile = await prisma.profile.findUnique({
   where: {
    email:email
   },    
  }); 

  console.log('userProfile,', userProfile); 

  return userProfile; 

}

export const checkExistingUser = async (email: string) => {
  console.log("check for existing user");

  const existingUser = await prisma.profile.findUnique({
    where: {
      email,
    },
  });

  console.log("exitin user", existingUser);
  return existingUser;
};
