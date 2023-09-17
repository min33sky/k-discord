import { useSocket } from '@/components/providers/socket-provider';
import { MessageWithMemberWithProfile } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ChatSocketProps = {
  addKey: string; // 메세지 등록 시 사용할 Socket.io Key Name
  updateKey: string; // 메세지 수정 시 사용할 Socket.io Key Name
  queryKey: string; // react-query Key (캐시를 수정하기 위해 사용함)
};

/**
 * 채팅 메세지 관련 socket.io 이벤트 처리를 담당하는 훅
 */
export default function useChatSocket({
  addKey,
  queryKey,
  updateKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // 채팅 메세지 수정 & 삭제 이벤트 핸들러
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              //? 수정한 메세지를 찾아서 데이터를 교체함
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // 채팅 메세지 추가 이벤트 핸들러
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [addKey, queryClient, queryKey, socket, updateKey]);
}
