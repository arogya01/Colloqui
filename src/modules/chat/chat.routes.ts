import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createConversation,
  createMessage,
  fetchAllConversations,
  fetchAllMessages,
} from "./chat.service";
import { $ref, createConversationSchema } from "./chat.schema";
import { CHAT_EVENTS } from "./chat.constants";

interface MyCustomRequest extends FastifyRequest {
  decodedToken: any;
  query : {
    id: string;
  }
}

interface QueryStringType {
  userId:number;
}

export async function chatRoutes(server: FastifyInstance) {
  // console.log("server", server.websocketServer);
  server.get("/chat", { websocket: true }, async (connection, req:MyCustomRequest) => {
    const token = req.headers['sec-websocket-protocol'];
    const { id } = req.query;
    console.log("hitting the web-scoket", id);

    if(!token){
      connection.socket.send(JSON.stringify({
        type: CHAT_EVENTS.ERROR,
        data: { error: "Invalid token" }
      }));
      connection.socket.close();
      return;
    }

    req.jwt.verify(token, (err,decoded) => {
      if(err){
        connection.socket.send(JSON.stringify({
          type: CHAT_EVENTS.ERROR,
          data: { error: "Invalid token" }
        }));
        connection.socket.close();
        return;
      }
    });

    connection.socket.on("message", async (message:any) => {
      try {
        const data = JSON.parse(message);

        console.log("data is", data);

        if (data?.type === CHAT_EVENTS.CREATE_CONVERSATION) {
          console.log("data", data);
          const resp = await createConversation(
            data.participants,
            data.message,
            data.groupName
          );
          console.log("resp", resp);
          // emitting back the conversation id to the client
          connection.socket.send(
            JSON.stringify({
              type: CHAT_EVENTS.CONVERSATION_CREATED,
              data: { conversationId: resp },
            })
          );

          // create the conversation between the users yeah...
        }

        if (data?.type === CHAT_EVENTS.SEND_MESSAGE) {
          const createdMessage = await createMessage(data);
          connection.socket.send(
            JSON.stringify({
              type: CHAT_EVENTS.MESSAGE_SENT,
              data: { createdMessage },
            })
          );
        }

        if (data?.type === CHAT_EVENTS.FETCH_MESSAGES) {
          const messages = await fetchAllMessages(data.conversationId);

          connection.socket.send(
            JSON.stringify({
              type: CHAT_EVENTS.FETCH_MESSAGES,
              data: { messages },
            })
          );
        }

        if (data?.type === CHAT_EVENTS.FETCH_CONVERSATIONS) {
          const conversations = await fetchAllConversations(data.userId);

          connection.socket.send(
            JSON.stringify({
              type: CHAT_EVENTS.FETCH_CONVERSATIONS,
              data: { conversations },
            })
          );
        }

      } catch (err) {
        console.log("Error parsing JSON", err);
      }
    });

    connection.socket.on("close", () => {
      console.log("connection closed");
    });
  });

  server.get("/conversations/:userId", async (req, reply) => {
    const { userId } = req.params as QueryStringType;

    if (!userId) {
      reply.code(400).send({
        error: "userId is required",
      });
    }

    try {
      const conversations = await fetchAllConversations(userId);
      reply.send(conversations);
    } catch (err) {
      console.log("error occured in fetching messages", err);
    }
  });
}
