import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { healthcareProfessionalValidationSchema } from 'validationSchema/healthcare-professionals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.healthcare_professional
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHealthcareProfessionalById();
    case 'PUT':
      return updateHealthcareProfessionalById();
    case 'DELETE':
      return deleteHealthcareProfessionalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHealthcareProfessionalById() {
    const data = await prisma.healthcare_professional.findFirst(
      convertQueryToPrismaUtil(req.query, 'healthcare_professional'),
    );
    return res.status(200).json(data);
  }

  async function updateHealthcareProfessionalById() {
    await healthcareProfessionalValidationSchema.validate(req.body);
    const data = await prisma.healthcare_professional.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteHealthcareProfessionalById() {
    const data = await prisma.healthcare_professional.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
