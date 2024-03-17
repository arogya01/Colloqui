import { FastifyInstance } from "fastify";

async function chatRoutes(server: FastifyInstance){

     
    server.get("/chat/",{websocket: true}, (connection, req) => {


        connection.socket.on("message",(message)=>{
            connection.socket.send("hi from server");

        });
    }); 
}