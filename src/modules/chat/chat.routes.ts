import { FastifyInstance } from "fastify";
import {
  createConversation,
  createMessage,
  fetchAllConversations,
  fetchAllMessages,
} from "./chat.service";
import { $ref, createConversationSchema } from "./chat.schema";
import { CHAT_EVENTS } from "./chat.constants";

export async function chatRoutes(server: FastifyInstance) {
  // console.log("server", server.websocketServer);
  server.get("/chat", { websocket: true }, async (connection, req) => {
    const { id } = req.query;
    console.log("hitting the web-scoket", id);

    connection.socket.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        // const parsedMessage = createConversationSchema.safeParse(data);

        // if (!parsedMessage.success) {
        //   connection.socket.send(
        //     JSON.stringify({ error: "insuffcient details bruh" })
        //   );
        //   return;
        // }

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
      } catch (err) {
        console.log("Error parsing JSON", err);
      }
    });

    connection.socket.on("close", () => {
      console.log("connection closed");
    });
  });

  server.get("/conversations/:userId", async (req, reply) => {
    const { userId } = req.params;

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
