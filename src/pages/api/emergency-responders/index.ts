import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { emergencyResponderValidationSchema } from 'validationSchema/emergency-responders';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEmergencyResponders();
    case 'POST':
      return createEmergencyResponder();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmergencyResponders() {
    const data = await prisma.emergency_responder
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'emergency_responder'));
    return res.status(200).json(data);
  }

  async function createEmergencyResponder() {
    await emergencyResponderValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.emergency_responder.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
