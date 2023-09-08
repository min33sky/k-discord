'use server';

import { currentProfile } from '@/lib/current-profile';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';
import { MemberRole } from '@prisma/client';

/**
 * 새로운 서버를 생성한다.
 * @param name 서버 이름
 * @param imageUrl 서버 이미지 URL
 *
 */
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

interface UpdateServerProps {
  serverId: string;
  name: string;
  imageUrl: string;
}

/**
 * 서버를 업데이트한다.
 * @param serverId 서버 아이디
 * @param name 서버 이름
 * @param imageUrl 서버 이미지 URL
 */
export async function updateServer({
  imageUrl,
  name,
  serverId,
}: UpdateServerProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to update a server');
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        imageUrl,
        name,
      },
    });

    return server;
  } catch (error: any) {
    console.log('[updateServer] error : ', error);
    throw new Error(error.message);
  }
}

/**
 * 서버 초대 코드를 업데이트한다.
 * @param serverId 서버 아이디
 */
export async function updateServerInviteCode(serverId: string) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to update a server');
    }

    const inviteCode = uuidv4();

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode,
      },
    });

    return server;
  } catch (error: any) {
    console.log('[updateServerInviteCode] error : ', error);
    throw new Error(error.message);
  }
}
