import { users } from '@prisma/client';
import {
  DiscordMessage,
  DiscordAuthor,
  DiscordGuildMember,
} from 'types/discord';
import { generateRandomWordSlug } from 'utilities/randomWordSlugs';
import { LIMIT } from './constrains';
import DiscordApi from './api';
import to from 'utilities/await-to-js';
import UsersService from 'services/users';

// helper for messages
export function getMentions(
  mentions: DiscordAuthor[] | undefined,
  users: users[]
) {
  function reduceMentions(
    previous: { usersId: string }[],
    current: DiscordAuthor
  ) {
    const usersId = users.find(
      (user) => user.externalUserId === current.id
    )?.id;
    return [...previous, ...(usersId ? [{ usersId }] : [])];
  }
  return mentions && mentions.reduce(reduceMentions, []);
}

// helper for messages
export function getUsersInMessages(messages: DiscordMessage[]) {
  return messages.reduce((acc: DiscordAuthor[], message) => {
    acc.push(message.author);
    message.mentions && acc.push(...message.mentions);
    return acc;
  }, []);
}

export async function crawlUsers({
  accountId,
  serverId,
  token,
}: {
  accountId: string;
  serverId: string;
  token: string;
}) {
  console.log('crawlUsers >> started');
  let hasMore = true;
  let after;
  do {
    const [err, response] = await to(
      DiscordApi.getDiscordUsers({ limit: LIMIT, serverId, token, after })
    );
    if (err) {
      console.warn('crawlUsers >> finished with failure:', err);
      return;
    }
    const users = response as DiscordGuildMember[];
    await Promise.all(
      users.map((u) => parseUser(u, accountId)).map(UsersService.upsertUser)
    );
    console.log('users.length', users.length);
    if (users.length) {
      after = users.pop()?.user?.id;
    } else {
      hasMore = false;
    }
  } while (hasMore);
  console.log('crawlUsers >> finished');
}

const parseUser = (guildMember: DiscordGuildMember, accountId: string) => {
  return {
    externalUserId: guildMember.user?.id!,
    accountsId: accountId,
    displayName: guildMember.nick || guildMember.user?.username || 'unknown',
    anonymousAlias: generateRandomWordSlug(),
    isAdmin: false,
    isBot: guildMember.user?.bot || false,
    ...((guildMember.avatar || guildMember.user?.avatar) && {
      profileImageUrl: buildUserAvatar({
        userId: guildMember.user?.id!,
        avatarId: guildMember.avatar || guildMember.user?.avatar!,
      }),
    }),
  };
};

function buildUserAvatar({
  userId,
  avatarId,
}: {
  userId: string;
  avatarId: string;
}): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
}

export async function findUsers(
  accountId: string,
  usersInMessages: DiscordAuthor[]
) {
  return UsersService.findUsersByExternalId(
    accountId,
    usersInMessages.map((u) => u.id)
  );
}
