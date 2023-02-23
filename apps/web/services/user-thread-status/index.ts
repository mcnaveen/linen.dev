import { prisma } from '@linen/database';

class UserThreadStatusService {
  static async markAsUnreadForAllUsers(threadId: string) {
    return prisma.userThreadStatus.deleteMany({
      where: {
        threadId,
        read: true,
      },
    });
  }

  static async markAsUnmutedForMentionedUsers(
    threadId: string,
    userIds: string[]
  ) {
    if (userIds.length === 0) {
      return Promise.resolve();
    }
    return prisma.userThreadStatus.deleteMany({
      where: {
        threadId,
        userId: {
          in: userIds,
        },
        muted: true,
      },
    });
  }

  static async markAllAsRead({ userId }: { userId: string }) {
    return prisma.$queryRaw`
      INSERT INTO "userThreadStatus" ("userId", "threadId", "muted", "read", "createdAt", "updatedAt")
      SELECT ${userId}, t.id, false, true, current_timestamp, current_timestamp
      from threads as t
      ON CONFLICT DO NOTHING
    `;
  }
}

export default UserThreadStatusService;
