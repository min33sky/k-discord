import { currentProfilePages } from '@/lib/current-profile-page';
import prisma from '@/lib/db';
import { NextApiResponseServerIo } from '@/types';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query as {
      messageId: string;
      serverId: string;
      channelId: string;
    };
    const { content } = req.body as {
      content: string;
    };

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' });
    }

    // 사용자가 접속한 서버 정보를 가져온다.
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // 채널 정보를 가져온다.
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // 사용자 정보를 가져온다
    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // 메세지 정보를 가져온다.
    let message = await prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // 존재하지 않는 메세지거나 삭제된 메세지면 404
    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    //? 수정 권한 또는 삭제 권한이 없다면 401
    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    //* 메세지 삭제 기능 (Soft Delete)
    if (req.method === 'DELETE') {
      message = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    //* 메세지 수정 기능
    if (req.method === 'PATCH') {
      // 메세지 작성자만 수정할 수 있다.
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      message = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    // Socket.io에 연결된 채널 사용자들에게 메세지를 전송한다.
    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
