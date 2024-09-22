import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput } from "./user.schema";
import { checkExistingUser, createUser, fetchUserByEmail } from "./user.service";
import { verifyPassword } from "../../utils/hash";

export const loginHandler = async (
  request: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply
) => {
  console.log("loginHandler");

  const body = request.body;

  const user = await checkExistingUser(body.email);
  console.log("logged-in user, ", user);

  if (!user)
    return reply.code(401).send({ message: "user not found or invalid user" });

  const correctPass = await verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPass) {
    const {userId,  password, salt, ...rest } = user;

    // request already has access to jwt??
    // so we can just use it to sign the token,
    return { accessToken: request.jwt.sign(rest) , userId };
  }

  return reply.code(401).send({ message: "invalid password" });
};

export async function signupHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  console.log("signup user", request.body);

  const body = request.body;
  const isExistingUser = await checkExistingUser(body.email);
  if (isExistingUser)
    return reply.code(400).send({ message: "user already exists" });

  try {
    const user = await createUser(body);
    console.log("user", user);
    return reply.code(200).send({ message: "user created successfully" });
  } catch (error) {
    console.log("error occured in singup handler boy", error);
  }
}

export const getUsersHandler = () => {
  console.log("loginHandler");
};




interface DecodedToken {  
  [key: string]: any;
}

export const getUserProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log("getUserProfileHandler");

  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply.code(401).send({ error: 'No authorization header provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      reply.code(401).send({ error: 'No token provided' });
      return;
    }

    // Decode the token
    const decodedToken = request.jwt.decode(token) as DecodedToken;
    console.log('decoded', decodedToken);

    if (!decodedToken) {
      reply.code(401).send({ error: 'Invalid token' });
      return;
    }

    const email = decodedToken.email; 
    if (!email) {
      reply.code(401).send({ error: 'user details not found in token' });
      return;
    }

    // Find the user in the database
    const user = await fetchUserByEmail(email);
    console.log('got the user',user);
    if (!user) {
      reply.code(404).send({ error: 'User not found' });
      return;
    }

    // Return the user profile
    reply.send(user);
  } catch (error) {
    console.error('Error in getUserProfileHandler:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
};