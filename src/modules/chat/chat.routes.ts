import { FastifyInstance } from "fastify";
import { extractLastConversation } from "./chat.service";

export async function chatRoutes(server: FastifyInstance) {
  server.get("/chat", { websocket: true }, async (connection, req) => {
    const { conversationId } = req.query;

    // Find or create a conversation between the current user and the other user

    connection.socket.on("message", (message) => {
      connection.socket.send("hi from server");
    });
  });

  server.get("/conversations/:id/messages", async (req, reply) => {
    const { id } = req.params;

    try {
      const messages = extractLastConversation(id);
    } catch (err) {
      console.log("error occured in fetching messages", err);
    }
  });
}
