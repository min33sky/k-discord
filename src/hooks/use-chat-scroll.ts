'use client';

import { useEffect, useState } from 'react';

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number; // 채팅 메세지 개수
}

/**
 * 채팅창 스크롤 관련 처리 훅
 */
export default function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false);

  /**
   ** 채팅창 스크롤을 가장 위로 올렸을 때 더보기 함수를 호출한다.
   */
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener('scroll', handleScroll);

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  /**
   ** 메세지를 입력하면 채팅 스크롤을 가장 아래로 내린다.
   */
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      /**
       * 채팅 스크롤이 가장 아래로 내릴 때를 판단하는 로직
       * - topDiv.scrollHeight : 채팅창의 전체 높이
       * - topDiv.scrollTop : 현재 스크롤의 위치
       * - topDiv.clientHeight : 채팅창의 화면에 보이는 부분의 높이
       * - 계산해서 나온 값이 100보다 작을 경우 스크롤을 가장 아래로 내릴
       */
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [bottomRef, chatRef, hasInitialized, count]);
}
