import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import prisma from './db';

export async function initialProfile() {
  try {
    /**
     * Clerk 인증 정보를 DB에 저장합니다.
     * 이미 저장된 정보가 있다면 새로 저장하지 않습니다.
     */

    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      return profile;
    }

    // Clerk에서 제공하는 유저 정보를 기반으로 프로필을 생성합니다.
    const newProfile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error: any) {
    console.log('[initialProfile] error : ', error);
    throw new Error(error.message);
  }
}
