'use server';

import { currentProfile } from '@/lib/current-profile';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';

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

interface CreateChannelProps {
  serverId: string;
  name: string;
  type: ChannelType;
}

/**
 * 채널을 생성한다.
 * @param serverId 서버 아이디
 * @param name 채널 이름
 * @param type 채널 타입
 */
export async function createChannel({
  name,
  serverId,
  type,
}: CreateChannelProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to create a channel');
    }

    //? 채널을 생성하려면 해당 서버를 업데이트하는 방식으로 구현해야 한다.
    const updatedServer = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return updatedServer;
  } catch (error: any) {
    console.log('[createChannel] error : ', error);
    throw new Error(error.message);
  }
}

/**
 * 서버 삭제하기
 * @param serverId 서버 아이디
 */
export async function deleteServer(serverId: string) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to delete a server');
    }

    const deletedServer = await prisma.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return deletedServer;
  } catch (error: any) {
    console.log('[deleteServer] error : ', error);
    throw new Error(error.message);
  }
}

/**
 * 서버에서 나가기
 * @param serverId 서버 아이디
 */
export async function leaveServer(serverId: string) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to leave a server');
    }

    const updatedServer = await prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id, //? 서버 생성자가 아닌 경우에만 서버를 나갈 수 있다.
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return updatedServer;
  } catch (error: any) {
    console.log('[leaveServer] error : ', error);
    throw new Error(error.message);
  }
}

interface EditChannelProps {
  serverId: string;
  channelId: string;
  name: string;
  type: ChannelType;
}

/**
 * 채널 업데이트
 * @param channelId 채널 아이디
 * @param serverId 서버 아이디
 * @param name 채널 이름
 * @param type 채널 타입
 */
export async function updateChannel({
  channelId,
  name,
  serverId,
  type,
}: EditChannelProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to edit a channel');
    }

    const updatedServer = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return updatedServer;
  } catch (error: any) {
    console.log('[editChannel] error : ', error);
    throw new Error(error.message);
  }
}

/**
 * 채널 삭제
 * @param channelId
 * @param serverId
 */
export async function deleteChannel({
  channelId,
  serverId,
}: {
  serverId: string;
  channelId: string;
}) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to delete a channel');
    }

    const updatedServer = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    return updatedServer;
  } catch (error: any) {
    console.log('[deleteChannel] error : ', error);
    throw new Error(error.message);
  }
}
