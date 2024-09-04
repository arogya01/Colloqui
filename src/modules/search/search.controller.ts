import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { SearchQueryInput } from "./search.schema";
import prisma from "../../utils/prisma";

export async function searchUsers(
  request: FastifyRequest<{ QueryString: SearchQueryInput }>,
  reply: FastifyReply
) {
  const { username, email, phone } = request.query;

  const whereClause: any = {};

  if (username) {
    whereClause.Profile = {
      ...whereClause.Profile,
      userName: { contains: username, mode: "insensitive" },
    };
  }

  if (email) {
    whereClause.Profile = {
      ...whereClause.Profile,
      email: { contains: email, mode: "insensitive" },
    };
  }

  if (phone) {
    whereClause.Profile = {
      ...whereClause.Profile,
      phoneNumber: { contains: phone },
    };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      Profile: {
        select: {
          userName: true,
          email: true,
          phoneNumber: true,
          bio: true,
          image: true,
        },
      },
    },
  });

  return users;
}
