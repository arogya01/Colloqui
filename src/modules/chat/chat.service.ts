import prisma from "../../utils/prisma";

export const extractLastConversation = async (userId: string) => {
  console.log("extractLastConversation");

  let conversation = await prisma.conversation.findFirst({
    where: {
      participant: {
        some: {
          userId: parseInt(userId),
        },
      },
    },
  });

  return conversation;
};

export const createConversation = async (
  userId: string,
  otherUserId: string
) => {
  return await prisma.conversation.create({
    data: {
      participant: {
        create: [
          { userId: parseInt(userId) },
          { userId: parseInt(req.user.id) },
        ],
      },
    },
  });
};
