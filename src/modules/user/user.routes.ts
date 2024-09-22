import { FastifyInstance } from "fastify";
import { loginHandler , signupHandler , getUsersHandler, getUserProfileHandler } from "./user.controller";
import { $ref } from "./user.schema";


async function userRoutes(server: FastifyInstance){
    server.post("/login", {
        schema : {
            body: $ref("loginUserSchema"),
            response : {
                200 : $ref("loginRespSchema")
            }
        }
    } ,loginHandler);
    server.post("/signup",{
        schema: {
            body : $ref("createUserSchema"),
            response : {
                201 : $ref("createUserRespSchema")
            }
        }
    }, signupHandler);
    server.get("/profile",{
        schema: {            
            response: {
                200: $ref("getUserProfileRespSchema")
            }
        }
    }, getUserProfileHandler);
}

export default userRoutes; 