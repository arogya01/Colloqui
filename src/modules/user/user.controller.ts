import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput } from "./user.schema";
import { createUser } from "./user.service";


export const loginHandler =() => {
    console.log('loginHandler');
}
export async function signupHandler (request: FastifyRequest<{
    Body : CreateUserInput
}>, 
reply: FastifyReply
) {
 console.log('signup user', request.body);

 const body = request.body; 

 try{
   const user = await createUser(body);
   return reply.code(201).send(user);
 }
 catch(error){
    console.log('error occured in singup handler boy', error);
 }
}

export const getUsersHandler =() => {
    console.log('loginHandler');
}