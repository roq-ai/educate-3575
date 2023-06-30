import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { emergencyResponderValidationSchema } from 'validationSchema/emergency-responders';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.emergency_responder
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEmergencyResponderById();
    case 'PUT':
      return updateEmergencyResponderById();
    case 'DELETE':
      return deleteEmergencyResponderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmergencyResponderById() {
    const data = await prisma.emergency_responder.findFirst(convertQueryToPrismaUtil(req.query, 'emergency_responder'));
    return res.status(200).json(data);
  }

  async function updateEmergencyResponderById() {
    await emergencyResponderValidationSchema.validate(req.body);
    const data = await prisma.emergency_responder.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEmergencyResponderById() {
    const data = await prisma.emergency_responder.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
