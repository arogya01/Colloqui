import { FastifyInstance } from "fastify";
import { extractLastConversation } from "./chat.service";

export async function chatRoutes(server: FastifyInstance) {
  // console.log("server", server.websocketServer);
  server.get("/chat", { websocket: true }, async (connection, req) => {
    const { id } = req.query;
    console.log("hitting the web-scoket", id);

    // Find or create a conversation between the current user and the other user
    // need to add the message logic over here, adding transactions in prisma for that... 

    connection.socket.on("message", async (message) => {
      console.log("message received", message);

      try {
        const data = JSON.parse(message);
        console.log('data is', data);

        if (data?.type === "CREATE") {
          console.log("create conversation");

          // create the conversation between the users yeah...
        }
        console.log("message received", data);
        // You can now work with `data` as a JavaScript object
      } catch (err) {
        console.log("Error parsing JSON", err);
      }

      connection.socket.send("hi from server");
    });

    connection.socket.on("close", () => {
      console.log("connection closed");
    });
  });

  server.get("/conversations/:id/messages", async (req, reply) => {
    const { id } = req.params;

    try {
      const messages = extractLastConversation(id);

      if (messages === null) {
        // create the conversation between the users yeah... 

      }
    } catch (err) {
      console.log("error occured in fetching messages", err);
    }
  });

  server.post('/conversations/create', async (req, reply) => {

  });
}
