import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { medicalEducatorValidationSchema } from 'validationSchema/medical-educators';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.medical_educator
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMedicalEducatorById();
    case 'PUT':
      return updateMedicalEducatorById();
    case 'DELETE':
      return deleteMedicalEducatorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMedicalEducatorById() {
    const data = await prisma.medical_educator.findFirst(convertQueryToPrismaUtil(req.query, 'medical_educator'));
    return res.status(200).json(data);
  }

  async function updateMedicalEducatorById() {
    await medicalEducatorValidationSchema.validate(req.body);
    const data = await prisma.medical_educator.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMedicalEducatorById() {
    const data = await prisma.medical_educator.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
