import { Conversation } from "@prisma/client";
import prisma from "../../utils/prisma";

export const extractLastConversation = async (conversationId: string) => {
  console.log("extractLastConversation");

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
  });

  return messages;
};

export const createMessage = async (conversationId: string) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      content: "Hello World",
    },
  });

  return message;
}


// should I just get in participants array?? 
export const createConversation = async (
  participants: number[],
  groupName?: string
) => {
  // if between the two user, then no need to create the conversation name, 

  try {
    const result = await prisma.conversation.create({
      data: {
        updatedAt: new Date(),
        name: groupName,
        participant: {
          createMany: {
            data: participants.map((participant) => ({
              userId: participant
            }))
          }
        }

      },
    });
    return result;
  }
  catch (err) {
    console.log('error occured in creating conversation', err);
  }
};

export async function createConversations(name: string | null, userIds: number[]): Promise<Conversation> {
  const conversation = await prisma.conversation.create({
    data: {
      name,
      participant: {
        create: userIds.map((userId) => ({
          user: { connect: { id: userId } },
        })),
      },
    },
    include: { participant: { include: { user: true } } },
  });

  return conversation;
}
