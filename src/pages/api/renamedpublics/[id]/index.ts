import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { renamedpublicValidationSchema } from 'validationSchema/renamedpublics';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.renamedpublic
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRenamedpublicById();
    case 'PUT':
      return updateRenamedpublicById();
    case 'DELETE':
      return deleteRenamedpublicById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRenamedpublicById() {
    const data = await prisma.renamedpublic.findFirst(convertQueryToPrismaUtil(req.query, 'renamedpublic'));
    return res.status(200).json(data);
  }

  async function updateRenamedpublicById() {
    await renamedpublicValidationSchema.validate(req.body);
    const data = await prisma.renamedpublic.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRenamedpublicById() {
    const data = await prisma.renamedpublic.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
