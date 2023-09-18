import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import prisma from '@/lib/db';
import ServerHeader from './server-header';
import {
  HashIcon,
  MicIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  VideoIcon,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';
import { ROLE_ICON_MAP } from '@/constants';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <HashIcon className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <MicIcon className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <VideoIcon className="mr-2 h-4 w-4" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  /**
   * 해당 서버의 모든 채널과 유저들을 포함한 정보를 가져온다
   */
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
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

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'MEMBERS',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: ROLE_ICON_MAP[member.role],
                })),
              },
            ]}
          />
        </div>

        {/* 서버 채널 목록 */}
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
