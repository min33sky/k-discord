import { Server, Member, Profile } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
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
