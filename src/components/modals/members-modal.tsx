'use client';

import { Button } from '../ui/button';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

import { Input } from '../ui/input';
import { useModal } from '@/hooks/useModalStore';
import {
  Check,
  CheckIcon,
  Copy,
  GavelIcon,
  Loader2,
  MoreVerticalIcon,
  RefreshCw,
  ShieldAlert,
  ShieldAlertIcon,
  ShieldIcon,
  ShieldQuestionIcon,
} from 'lucide-react';
import { Label } from '../ui/label';
import { useState } from 'react';
import { updateServerInviteCode } from '@/actions/server.action';
import { useRouter } from 'next/navigation';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { kickMember, updateMemberRole } from '@/actions/member.action';
import { MemberRole } from '@prisma/client';

const roleIconMap = {
  ADMIN: <ShieldAlertIcon className="w-4 h-4 text-rose-500" />,
  MODERATOR: <ShieldAlertIcon className="w-4 h-4 ml-2 text-indigo-500" />,
  GUEST: null,
};

export default function MembersModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as {
    server: ServerWithMembersWithProfiles;
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      // TODO: 서버에 요청을 보내서 멤버를 추방한다
      const updatedServer = await kickMember(server.id, memberId);

      router.refresh();
      onOpen('members', {
        server: updatedServer,
      });

      console.log('멤버 추방에 성공했습니다');
    } catch (error) {
      console.log('멤버 추방에 실패했습니다', error);
    } finally {
      setLoadingId('');
    }
  };

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      // const url = qs.stringifyUrl({
      //   url: `/api/members/${memberId}`,
      //   query: {
      //     serverId: server?.id,
      //   }
      // });

      // TODO: 서버에 요청을 보내서 멤버 역할을 변경한다
      const updatedServer = await updateMemberRole({
        memberId,
        serverId: server?.id,
        role,
      });

      router.refresh();

      // TODO: Modal 상태를 업데이트한다. onOpen()을 사용한다
      onOpen('members', {
        server: updatedServer,
      });
    } catch (error) {
      console.log('멤버 역할 변경에 실패했습니다', error);
    } finally {
      setLoadingId('');
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            맴버 관리
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] px-6">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>

              {/* Role Action Button */}
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVerticalIcon className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestionIcon className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log('게스트로 변경');
                                  handleRoleChange(member.id, 'GUEST');
                                }}
                              >
                                <ShieldIcon className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <CheckIcon className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log('중재자로 변경');
                                  handleRoleChange(member.id, 'MODERATOR');
                                }}
                              >
                                <ShieldIcon className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <CheckIcon className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                          <GavelIcon className="h-4 w-4 mr-2" />
                          강퇴하기
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

              {/* 로더 */}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
