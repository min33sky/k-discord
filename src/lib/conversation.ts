import prisma from './db';

/**
 * 1:1 대화 정보를 가져오거나 없을 시 생성한다.
 *
 * @param memberOneId DM 초대하는 사람 아이디
 * @param memberTwoId DM 초대받는 사람 아이디
 */
export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  try {
    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));

    if (!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
  } catch (error: any) {
    console.log('[getOrCreateConversation] error : ', error);
    return null;
  }
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log('[findConversation] error : ', error);
    return null;
  }
}

async function createNewConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log('[createNewConversation] error : ', error);
    return null;
  }
}
