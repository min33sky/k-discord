'use server';

import { currentProfile } from '@/lib/current-profile';
import prisma from '@/lib/db';
import { Message } from '@prisma/client';

interface getChatMessagesParams {
  cursor?: string;
  channelId: string;
}

/**
 * 채팅 메세지 가져오기
 * @param channelId 채팅 채널 아이디
 * @param cursor? 마지막 메세지의 아이디
 */
export async function getChatMessages({
  channelId,
  cursor,
}: getChatMessagesParams) {
  try {
    const MESSAGES_BATCH = 10; //? 가져올 메세지 개수

    const profile = await currentProfile();

    if (!profile) {
      throw new Error('You must be logged in to get chat messages');
    }

    let messages: Message[] = [];

    if (cursor) {
      // 커서 이후의 데이터를 가져오기
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH, // 10개
        skip: 1, //? 커서 이후의 데이터부터 가져온다.
        cursor: {
          id: cursor, //? 마지막 데이터의 아이디 값
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // 처음 호출 시
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH, // 10개
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    /**
     *? 10개를 가져오고 마지막 데이터의 id를 nextCursor로 지정하는 방식을 사용.
     *? 10개 미만일 경우 마지막 페이지이고, 10개일 경우 다음 페이지가 있을 수도 있음.
     ** 11개를 가져와서 11개일 경우 마지막 1개는 pop한 후 그 데이터를 nextCursor로 지정하는 방식도 있음
     ** 그러면 skip : 1을 할 필요가 없어지고 또 호출 횟수를 한번 줄일 수 있을것같다.
     */

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return {
      items: messages,
      nextCursor,
    };
  } catch (error: any) {
    console.log('[getChatMessages] error : ', error);
    throw new Error(error.message);
  }
}
