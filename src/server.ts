import "dotenv/config";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import userRoutes from "./modules/user/user.routes";
import { userSchemas } from "./modules/user/user.schema";
import fastifyWebsocket from "@fastify/websocket";
import { chatRoutes } from "./modules/chat/chat.routes";
import { chatSchemas } from "./modules/chat/chat.schema";
import searchRoutes from "./modules/search/search.routes";
import { searchSchemas } from "./modules/search/search.schema";

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
  const server = Fastify({
    logger:true
  });

  console.log('started build Server');

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

  const allSchemas = [...userSchemas, ...chatSchemas, ...searchSchemas];

  // Add schemas, avoiding duplicates
  const addedSchemas = new Set();
  for (const schema of allSchemas) {
    if (schema.$id && !addedSchemas.has(schema.$id)) {
      server.addSchema(schema);
      addedSchemas.add(schema.$id);
    }
  }
  

  server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      message: 'Welcome to the chat app'
    }
  }); 

  server.register(userRoutes, { prefix: "api/users" });
  server.register(chatRoutes, { prefix: "api/colloqui" });
  server.register(searchRoutes, {prefix:"api/users" });

  server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    }
  });

  return server;
}

export default buildServer;
