import { Server, Member, Profile, Message } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

export type GetChatMessagesResponse = {
  items: MessageWithMemberWithProfile[];
  nextCursor?: string;
};

/**
 * NextJS에서 Socket.io를 사용하기 위한 타입 확장
 */
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
