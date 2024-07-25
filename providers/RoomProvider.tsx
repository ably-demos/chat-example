import { FC, ReactNode, useMemo } from 'react';
import { RoomOptionsDefaults } from '@ably/chat';
import { useChatClient } from '@ably/chat/react';

import { createContext } from 'react';
import { Room } from '@ably/chat';

interface RoomContextProps {
  room: Room;
}

export const RoomContext = createContext<RoomContextProps | undefined>(undefined);


interface RoomProviderProps {
  roomId: string;
  children: ReactNode;
}

export const RoomProvider: FC<RoomProviderProps> = ({ roomId: roomId, children }) => {
  const client = useChatClient();
  const value = useMemo(
    () => ({
      client,
      room: client.rooms.get(roomId, {
        presence: RoomOptionsDefaults.presence,
        reactions: RoomOptionsDefaults.reactions,
        typing: RoomOptionsDefaults.typing,
        occupancy: RoomOptionsDefaults.occupancy,
      }),
    }),
    [client, roomId],
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
