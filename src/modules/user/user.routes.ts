import { FastifyInstance } from "fastify";
import{
    loginHandler, 
    signupHandler, 
    getUsersHandler,
}
from "./user.controller";

async function userRoutes(server: FastifyInstance){
    server.post("/login", loginHandler);
    server.post("/signup", signupHandler);
    server.get("/users", getUsersHandler);
}