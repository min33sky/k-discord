import { getChatMessages, getDirectMessages } from '@/actions/chat.action';
import { useSocket } from '@/components/providers/socket-provider';
import { GetChatMessagesResponse, GetDirectMessagesResponse } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ChatQueryProps {
  queryKey: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export default function useChatQuery({
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const mode = paramKey === 'channelId' ? 'channelId' : 'conversation';

    console.log('모ㅗㅗㅗㅗㅗㅗㅗㄷ, : ', mode);

    if (mode === 'channelId') {
      const response = (await getChatMessages({
        channelId: paramValue,
        cursor: pageParam,
      })) as GetChatMessagesResponse;

      console.log('채팅 메세지 가겨오기: ', response);

      return response;
    } else {
      const response = (await getDirectMessages({
        conversationId: paramValue,
        cursor: pageParam,
      })) as GetDirectMessagesResponse;

      console.log('다이렉트 메세지 가겨오기: ', response);

      return response;
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000, //? Falling 모드시 1초마다 리패치
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
