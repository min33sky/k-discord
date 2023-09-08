'use server';

import { currentProfile } from '@/lib/current-profile';
import prisma from '@/lib/db';
import { MemberRole } from '@prisma/client';

interface UpdateMemberRoleProps {
  serverId: string;
  memberId: string;
  role: MemberRole;
}

/**
 * 해당 서버의 멤버 권한을 업데이트한다.
 * @param serverId 서버 ID
 * @param memberId 멤버 ID
 * @param role 업데이트할 멤버 권한
 */
export async function updateMemberRole({
  memberId,
  role,
  serverId,
}: UpdateMemberRoleProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to update a member role');
    }

    //? 업데이트 된 서버 정보를 반환한다.
    const updatedServer = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return updatedServer;
  } catch (error: any) {
    console.log('[updateMemberRole] error : ', error);
    throw new Error(error.message);
  }
}

export async function kickMember(serverId: string, memberId: string) {
  try {
    // TODO: 강퇴
  } catch (error: any) {
    console.log('[kickMember] error : ', error);
    throw new Error(error.message);
  }
}
