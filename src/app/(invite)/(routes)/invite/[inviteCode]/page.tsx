import { currentProfile } from '@/lib/current-profile';
import prisma from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodePage({ params }: Props) {
  const profile = await currentProfile();

  // 로그인이 안되어있으면 로그인 페이지로 이동
  if (!profile) {
    return redirectToSignIn();
  }

  // 초대코드가 없으면 메인 페이지로 이동
  if (!params.inviteCode) {
    return redirect('/');
  }

  // 이미 가입한 서버인지 확인
  const existingServer = await prisma.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // 이미 가입한 서버면 해당 서버로 이동
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
            //? role은 default로 'GUEST'로 설정
          },
        ],
      },
    },
  });

  console.log('*** 해당 서버 초대에 응하셨습니다.... ***');

  // 가입한 서버로 이동
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
