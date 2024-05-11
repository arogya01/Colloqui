import { FastifyInstance } from "fastify";
import { createConversation, fetchAllConversations } from "./chat.service";

export async function chatRoutes(server: FastifyInstance) {
  // console.log("server", server.websocketServer);
  server.get("/chat", { websocket: true }, async (connection, req) => {
    const { id } = req.query;
    console.log("hitting the web-scoket", id);

    // Find or create a conversation between the current user and the other user
    // need to add the message logic over here, adding transactions in prisma for that... 

    connection.socket.on("message", async (message) => {

      try {
        const data = JSON.parse(message);
        console.log('data is', data);

        if (data?.type === "CREATE") {
          console.log('data', data);
          const resp = await createConversation(data.participants, "");
          console.log("resp", resp);
          // emitting back the conversation id to the client
          connection.socket.send(JSON.stringify({ type: "CONVERSATION_CREATED", data: { conversationId: resp } }));

          // create the conversation between the users yeah...
        }
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

  server.get("/conversations/:userId", async (req, reply) => {
    const { userId } = req.params;

    if (!userId) {
      reply.code(400).send({
        error: "userId is required"

      })
    }

    try {
      const conversations = fetchAllConversations(userId);

      reply.send(conversations);


      // if (messages === null) {
      //   // create the conversation between the users yeah... 

      // }
    } catch (err) {
      console.log("error occured in fetching messages", err);
    }
  });

  server.post('/conversations/create', async (req, reply) => {

  });
}
