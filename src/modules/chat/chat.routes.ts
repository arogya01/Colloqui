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
  query: {
    id: string;
  }
}

interface QueryStringType {
  userId: number;
}

// Add a Set to store active connections
const activeConnections = new Set<WebSocket>();

export async function chatRoutes(server: FastifyInstance) {
  server.get("/chat", { websocket: true }, async (connection, req: MyCustomRequest) => {
    const token = req.headers['sec-websocket-protocol'];
    const { id } = req.query;
    console.log("hitting the web-socket", id);

    if (!id) {
      connection.socket.send(JSON.stringify({
        type: CHAT_EVENTS.ERROR,
        data: { error: "Invalid conversation id" }
      }));
      connection.socket.close();
      return;
    }

    if (!token) {
      connection.socket.send(JSON.stringify({
        type: CHAT_EVENTS.ERROR,
        data: { error: "Invalid token" }
      }));
      connection.socket.close();
      return;
    }

    req.jwt.verify(token, (err, decoded) => {
      if (err) {
        connection.socket.send(JSON.stringify({
          type: CHAT_EVENTS.ERROR,
          data: { error: "Invalid token" }
        }));
        connection.socket.close();
        return;
      }
    });

    // Add the connection to the Set
    activeConnections.add(connection.socket);

    // Broadcast the updated user count to all clients
    broadcastUserCount();

    connection.socket.on("message", async (message: any) => {
      try {
        const data = JSON.parse(message);
        
        if (data?.type === CHAT_EVENTS.CREATE_CONVERSATION) {
          console.log("data", data);
          const {data: {participants, message, groupName}} = data; 
          const resp = await createConversation(
            participants,
            message,
            groupName
          );
          console.log("resp", resp);
          connection.socket.send(
            JSON.stringify({
              type: CHAT_EVENTS.CONVERSATION_CREATED,
              data: { conversationId: resp },
            })
          );
        }

        // ... (rest of the message handling logic)

      } catch (err) {
        console.log("Error parsing JSON", err);
      }
    });

    connection.socket.on("close", () => {
      console.log("connection closed");
      // Remove the connection from the Set
      activeConnections.delete(connection.socket);
      // Broadcast the updated user count to all clients
      broadcastUserCount();
    });
  });

  // Add a new route to get the current number of connected users
  server.get("/connected-users", (req, reply) => {
    reply.send({ connectedUsers: activeConnections.size });
  });

  // ... (rest of the routes)
}

// Function to broadcast the user count to all connected clients
function broadcastUserCount() {
  const message = JSON.stringify({
    type: CHAT_EVENTS.USER_COUNT_UPDATE,
    data: { connectedUsers: activeConnections.size },
  });

  activeConnections.forEach((socket) => {
    socket.send(message);
  });
}