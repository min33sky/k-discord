import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prisma from './db';

/**
 * NextJS Pages API에서 사용하는 인증 함수
 * @param req NextApiRequest
 */
export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
