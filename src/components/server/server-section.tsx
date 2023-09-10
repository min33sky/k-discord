'use client';

import { useModal } from '@/hooks/useModalStore';
import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole, ChannelType } from '@prisma/client';
import React from 'react';
import ActionTooltip from '../action-tooltip';
import { PlusIcon, SettingsIcon } from 'lucide-react';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType; // 채널 목록에서 사용
  server?: ServerWithMembersWithProfiles; // 맴버 목록에서 사용
}

/**
 * 해당 서버의 채널 및 유저들 목록을 구별하는 라벨
 *
 * @param {ServerSectionProps} props - The props object containing the following properties:
 *   - label: the label of the server section
 *   - role: the role of the member
 *   - sectionType: the type of section (channels or members)
 *   - channelType: the type of channel
 *   - server: the server object
 */
export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="채널 생성" side="top">
          <button
            onClick={() => onOpen('CREATE_CHANNEL', { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="맴버 관리" side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
