import { FastifyInstance } from "fastify";
import { extractLastConversation } from "./chat.service";

async function chatRoutes(server: FastifyInstance) {
  server.get("/chat/", { websocket: true }, async (connection, req) => {
    const { userId } = req.query;

    // Find or create a conversation between the current user and the other user

    const conversation = extractLastConversation(userId);

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant: {
            create: [
              { userId: parseInt(userId) },
              { userId: parseInt(req.user.id) },
            ],
          },
        },
      });
    }

    connection.socket.on("message", (message) => {
      connection.socket.send("hi from server");
    });
  });
}
