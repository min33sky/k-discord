'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModalStore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { deleteChannel, deleteServer } from '@/actions/server.action';

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'DELETE_CHANNEL';
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!server || !channel) return;

    try {
      setIsLoading(true);

      const response = await deleteChannel({
        channelId: channel.id,
        serverId: server.id,
      });

      console.log('채널 삭제 : ', response);

      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white text-black p-0 overflow-hidden">
        <AlertDialogHeader className="pt-8 px-6">
          <AlertDialogTitle className="text-2xl text-center font-bold">
            경고
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-zinc-500">
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>
            채널이 영구적으로 삭제됩니다. 정말 삭제하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="bg-gray-100 px-6 py-4">
          {/* <div className="flex items-center justify-between w-full"> */}
          <Button disabled={isLoading} onClick={onClose} variant="ghost">
            취소
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={onClick}>
            삭제
          </Button>
          {/* </div> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
