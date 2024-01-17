/*
  Warnings:

  - You are about to drop the column `ablyId` on the `ChannelReaction` table. All the data in the column will be lost.
  - You are about to drop the column `ablyId` on the `MessageReaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChannelReaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "channelId" INTEGER,
    "reactionId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "ChannelReaction_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ChannelReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChannelReaction" ("channelId", "createdAt", "id", "reactionId", "timestamp", "updatedAt") SELECT "channelId", "createdAt", "id", "reactionId", "timestamp", "updatedAt" FROM "ChannelReaction";
DROP TABLE "ChannelReaction";
ALTER TABLE "new_ChannelReaction" RENAME TO "ChannelReaction";
CREATE TABLE "new_MessageReaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,
    CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MessageReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MessageReaction" ("createdAt", "id", "messageId", "reactionId", "updatedAt", "userId") SELECT "createdAt", "id", "messageId", "reactionId", "updatedAt", "userId" FROM "MessageReaction";
DROP TABLE "MessageReaction";
ALTER TABLE "new_MessageReaction" RENAME TO "MessageReaction";
CREATE UNIQUE INDEX "MessageReaction_userId_messageId_reactionId_key" ON "MessageReaction"("userId", "messageId", "reactionId");
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ablyId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    CONSTRAINT "Message_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("ablyId", "channelName", "content", "createdAt", "id", "updatedAt") SELECT "ablyId", "channelName", "content", "createdAt", "id", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE UNIQUE INDEX "Message_ablyId_key" ON "Message"("ablyId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
