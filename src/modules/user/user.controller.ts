import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput } from "./user.schema";
import { checkExistingUser, createUser } from "./user.service";


export const loginHandler =(request: FastifyRequest<{
    Body: LoginUserInput
}>,
reply : FastifyReply
) => {
    console.log('loginHandler');

    const body = request.body; 
    
}
export async function signupHandler (request: FastifyRequest<{
    Body : CreateUserInput
}>, 
reply: FastifyReply
) {
 console.log('signup user', request.body);

 const body = request.body; 
 
 if(checkExistingUser(body.email)) return reply.code(400).send({message: 'user already exists'});

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