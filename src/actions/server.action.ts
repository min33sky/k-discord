'use server';

import { currentProfile } from '@/lib/current-profile';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function createServer({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string;
}) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to create a server');
    }

    /**
     * 서버를 생성하면서 기본 채널과 관리자 권한을 가진 멤버를 함께 생성한다.
     */

    const server = await prisma.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return server;
  } catch (error: any) {
    console.log('[createServer] error : ', error);
    throw new Error(error.message);
  }
}