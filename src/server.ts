import "dotenv/config";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import userRoutes from "./modules/user/user.routes";
import { userSchemas } from "./modules/user/user.schema";
import fastifyWebsocket from "@fastify/websocket";
import { chatRoutes } from "./modules/chat/chat.routes";
import { chatSchemas } from "./modules/chat/chat.schema";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

function buildServer() {
  const server = Fastify();

  server.register(fjwt, {
    secret: process.env.JWT_SECRET as string,
  });

  server.register(fastifyWebsocket);

  server.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );

  server.addHook("preHandler", (req, res, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });
  server.register(chatRoutes, { prefix: "api/colloqui" });

  server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    }
  });

  return server;
}

export default buildServer;
