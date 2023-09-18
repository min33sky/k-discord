import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'CREATE_SERVER'
  | 'INVITE_MEMBER'
  | 'EDIT_SERVER'
  | 'MEMBERS'
  | 'MESSAGE_FILE' // 채팅창 파일 업로드
  | 'LEAVE_SERVER' // 서버 나가기
  | 'DELETE_SERVER' // 서버 삭제
  | 'CREATE_CHANNEL' // 채널 만들기
  | 'DELETE_CHANNEL' // 채널 삭제
  | 'EDIT_CHANNEL' // 채널 수정
  | 'DELETE_MESSAGE'; // 채팅 메세지 삭제

interface ModalData {
  server?: Server; //? 현재 선택한 서버 데이터
  channel?: Channel;
  channelType?: ChannelType;

  //! 테스트용
  apiUrl?: string; // ? 임시 업로드용  (필요없으면 지움)
  query?: Record<string, any>; // ? 임시 업로드용 (필요없으면 지움)
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
