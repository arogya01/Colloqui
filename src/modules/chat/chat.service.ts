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

export const createConversation = async (
  userId: string,
  otherUserId: string
) => {};
