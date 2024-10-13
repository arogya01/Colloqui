import { Conversation, MediaType } from "@prisma/client";
import prisma from "../../utils/prisma";

export const fetchAllConversations = async (userId: number) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participant: {
          some: {
            userId
          }
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            media: true,            
          }
        },  
        participant: {
          include: {
            user : {
              select: {
                id:true, 
                Profile: {
                  select: {
                    userName: true, 
                    image: true, 
                  }
                }
              }
            }
          }
        }            
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const transformedConversations = conversations.map(({participant,...conversation}) => ({
      ...conversation, 
      participants: participant.map(p => ({
        id: p.user.id, 
        userName: p.user.Profile?.userName, 
        image: p.user.Profile?.image, 
      }))
    }));

    return transformedConversations;
  } catch (error) {
    console.error("Error occurred in fetching all conversations", error);
    throw error;
  }
};

export const fetchAllMessages = async (conversationId: string) => {
  const id = parseInt(conversationId);
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: id,
      },
      include: {
        media: true,
      },
    });

    return messages;
  } catch (error) {
    console.error("error occured in fetching all messages", error);
  }
};

export const createMessage = async ({
  conversationId,
  value,
  valueType,
  senderId,
}: {
  conversationId: number;
  value: string;
  valueType: MediaType;
  senderId: number;
}) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      media: {
        create: {
          value,
          type: valueType,
        },
      },
    },
  });

  return message;
};

// should I just get in participants array??
export const createConversation = async (
  participants: number[],
  message: {
    senderId: number;
    value: string;
    valueType: MediaType;
  },
  groupName?: string
) => {
  console.log('service group name');
  console.log({ participants, message, groupName });
  // if between the two user, then no need to create the conversation name,

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participant: {
        every: {
          userId: { in: participants },
        },
      },
      AND: [
        {
          participant: {
            every: {
              userId: { in: participants },
            },
          },
        },
        {
          participant: {
            none: {
              userId: { notIn: participants },
            },
          },
        },
      ],
    },
  });

  if (existingConversation) {
    throw new Error("Conversation already exists between these two participants");
  }


  try {
    const result = await prisma.conversation.create({
      data: {
        updatedAt: new Date(),
        name: groupName,
        participant: {
          createMany: {
            data: participants.map((participant) => ({
              userId: participant,
            })),
          },
        },
        messages: {
          create: {
            senderId: message.senderId,
            media: {
              create: {
                value: message.value,
                type: message.valueType,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (err) {
    console.log("error occured in creating conversation", err);
  }
};

export async function createConversations(
  name: string | null,
  userIds: number[]
): Promise<Conversation> {
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
