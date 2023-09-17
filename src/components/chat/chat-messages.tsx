'use client';

import useChatQuery from '@/hooks/use-chat-query';
import { Member } from '@prisma/client';
import { Loader2, ServerCrashIcon } from 'lucide-react';
import React, { ElementRef, Fragment, useRef } from 'react';
import ChatWelcome from './chat-welcome';
import {
  DirectMessageWithMemberWithProfile,
  MessageWithMemberWithProfile,
} from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import ChatItem from './chat-item';
import useChatSocket from '@/hooks/use-chat-socket';
import useChatScroll from '@/hooks/use-chat-scroll';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl?: string; //? 필요 없을듯
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export default function ChatMessages({
  name,
  member,
  chatId,
  apiUrl, //! TODO: 삭제 예정
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  // 채팅창 스크롤 참조 위치
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      paramKey,
      paramValue,
    });

  //? 채팅 메세지 관련 Socket.IO 처리
  useChatSocket({ queryKey, addKey, updateKey });

  //? 채팅창 관련 스크롤 처리
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrashIcon className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              이전 메세지 불러오기
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map(
              (
                message:
                  | MessageWithMemberWithProfile
                  | DirectMessageWithMemberWithProfile,
              ) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  currentMember={member}
                  member={message.member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT, {
                    locale: ko,
                  })}
                  isUpdated={
                    new Date(message.updatedAt).getTime() !==
                    new Date(message.createdAt).getTime()
                  }
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ),
            )}
          </Fragment>
        ))}
      </div>

      <div aria-label="scroll ref to bottom" ref={bottomRef} />
    </div>
  );
}
