'use client';

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import {
  EditIcon,
  HashIcon,
  LockIcon,
  MicIcon,
  TrashIcon,
  VideoIcon,
} from 'lucide-react';
import React, { useCallback } from 'react';
import ActionTooltip from '../action-tooltip';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/hooks/useModalStore';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: MicIcon,
  [ChannelType.VIDEO]: VideoIcon,
};

/**
 * 서버 내의 채널을 선택할 수 있는 버튼
 *
 * @param {ServerChannelProps} {
 *   channel, server, role
 * } - The object containing the channel, server, and role information.
 */
export default function ServerChannel({
  channel,
  server,
  role,
}: ServerChannelProps) {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const handleClick = useCallback(() => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  }, [channel.id, params?.serverId, router]);

  /**
   * 해당 채널 버튼 영역의 액션 아이콘 클릭 핸들러
   */
  const handleAction = useCallback(
    (e: React.MouseEvent, action: ModalType) => {
      e.stopPropagation();
      onOpen(action, { channel, server });
    },
    [channel, onOpen, server],
  );

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />

      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {channel.name}
      </p>

      {/* 권한이 있는 맴버는 채널을 수정 또는 삭제가 가능하다 */}
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="수정">
            <EditIcon
              onClick={(e) => handleAction(e, 'EDIT_CHANNEL')}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="삭제">
            <TrashIcon
              onClick={(e) => handleAction(e, 'DELETE_CHANNEL')}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {/* 기본 채널은 잠금 표시 설정 */}
      {channel.name === 'general' && (
        <LockIcon className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}
