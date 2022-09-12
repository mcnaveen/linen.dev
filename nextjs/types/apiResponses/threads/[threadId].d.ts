import { channels, users } from '@prisma/client';
import { Permissions } from 'types/shared';

export type ThreadByIdResponse = ThreadById | { notFound: boolean };

export interface ThreadByIdProp extends ThreadById {
  isSubDomainRouting: boolean;
  permissions: Permissions;
}

export interface MentionsWithUsers extends mentions {
  users: users;
}

export type ThreadById = {
  id: string;
  incrementId: number;
  externalThreadId: string | null;
  viewCount: number;
  slug: string;
  messageCount: number;
  channelId: string;
  currentChannel: channels;
  messages: SerializedMessage[];
  channel: channels;
  threadId: string;
  authors: users[];
  channels: channels[];
  threadUrl: string | null;
  settings: Settings;
  pathCursor: string;
  title: string | null;
};

export interface Author {
  id: string;
  externalUserId: string;
  displayName: string;
  profileImageUrl: any;
  isBot: boolean;
  isAdmin: boolean;
  accountsId: string;
}
