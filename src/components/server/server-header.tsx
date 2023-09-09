'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModal } from '@/hooks/useModalStore';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles; // 현재 서버 정보
  role?: MemberRole;
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {(isModerator || isAdmin) && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            초대하기
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            서버 설정
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            맴버 관리
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {(isModerator || isAdmin) && (
          <DropdownMenuItem
            onClick={() => onOpen('CREATE_CHANNEL', { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            채널 만들기
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('DELETE_SERVER', { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            서버 삭제
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('LEAVE_SERVER', { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            서버 나가기
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
