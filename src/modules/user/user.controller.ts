import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput } from "./user.schema";
import { checkExistingUser, createUser } from "./user.service";
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
    const { password, salt, ...rest } = user;

    // request already has access to jwt??
    // so we can just use it to sign the token,
    return { accessToken: request.jwt.sign(rest) };
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
