'use client';

import { useState } from 'react';

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
import axios from 'axios';
import qs from 'query-string';

/**
 * 메세지 삭제 모달
 */
export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'DELETE_MESSAGE';

  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!apiUrl || !query) return;

    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query, //? serverId, channelId, messageId
      });

      const response = await axios.delete(url);

      console.log('메세지 삭제 : ', response);

      onClose();
    } catch (error) {
      console.log('메세지 삭제 실패 : ', error);
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
            정말로 메세지를 삭제하시겠습니까? <br />
            메세지는 영구적으로 삭제됩니다.
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
