import { NextApiRequest } from 'next';

import { NextApiResponseServerIo } from '@/types';
import { currentProfilePages } from '@/lib/current-profile-page';
import prisma from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body as {
      content: string;
      fileUrl: string;
    };
    const { conversationId } = req.query as {
      conversationId: string;
    };

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
    }

    /**
     * DM 메세지 전송 API를 요청한 회원이 속한 1:1 채팅방 정보를 가져오기
     */
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // DM을 보낸 회원 정보 가져오기
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // DM을 서버에 저장
    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Socket.IO에 연결된 상대방에게 DM 전송 이벤트를 호출함
    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
