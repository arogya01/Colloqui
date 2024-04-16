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

export const createMessage = async (conversationId:string) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      content: "Hello World",
    },
  });

  return message;
}

export const createConversation = async (
  userId: string,
  otherUserId: string
) => {};
