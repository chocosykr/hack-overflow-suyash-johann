/*
  Warnings:

  - The values [CLAIMED] on the enum `LostFoundStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `targetBlock` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `targetHostel` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `blockName` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `hostelName` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `LostItem` table. All the data in the column will be lost.
  - You are about to drop the column `blockName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hostelName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commentId,userId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[announcementId,userId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LostItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StaffSpecialization" AS ENUM ('ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'CLEANER', 'IT_SUPPORT', 'GENERAL_MAINTENANCE', 'SECURITY');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('DISCUSSION', 'OFFICIAL_UPDATE', 'INTERNAL_NOTE');

-- AlterEnum
BEGIN;
CREATE TYPE "LostFoundStatus_new" AS ENUM ('LOST', 'FOUND', 'RETURNED');
ALTER TABLE "public"."LostItem" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LostItem" ALTER COLUMN "status" TYPE "LostFoundStatus_new" USING ("status"::text::"LostFoundStatus_new");
ALTER TYPE "LostFoundStatus" RENAME TO "LostFoundStatus_old";
ALTER TYPE "LostFoundStatus_new" RENAME TO "LostFoundStatus";
DROP TYPE "public"."LostFoundStatus_old";
ALTER TABLE "LostItem" ALTER COLUMN "status" SET DEFAULT 'LOST';
COMMIT;

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_userId_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "targetBlock",
DROP COLUMN "targetHostel",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "targetBlockId" TEXT,
ADD COLUMN     "targetHostelId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "announcementId" TEXT,
ADD COLUMN     "lostItemId" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "type" "CommentType" NOT NULL DEFAULT 'DISCUSSION',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "issueId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "blockName",
DROP COLUMN "category",
DROP COLUMN "hostelName",
DROP COLUMN "mediaUrl",
DROP COLUMN "roomNumber",
ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "blockId" TEXT,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "customLocation" TEXT,
ADD COLUMN     "hostelId" TEXT,
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "roomId" TEXT,
ALTER COLUMN "reporterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LostItem" DROP COLUMN "imageUrl",
ADD COLUMN     "hostelId" TEXT,
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "announcementId" TEXT,
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "issueId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockName",
DROP COLUMN "hostelName",
DROP COLUMN "roomNumber",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "blockId" TEXT,
ADD COLUMN     "hostelId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "roomId" TEXT,
ADD COLUMN     "specialization" "StaffSpecialization",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "floor" INTEGER,
    "capacity" INTEGER DEFAULT 1,
    "blockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "specialization" "StaffSpecialization",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueStatusHistory" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "fromStatus" "IssueStatus",
    "toStatus" "IssueStatus" NOT NULL,
    "changedById" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IssueStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostItemClaim" (
    "id" TEXT NOT NULL,
    "lostItemId" TEXT NOT NULL,
    "claimantId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proofUrls" TEXT[],
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LostItemClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_name_key" ON "Hostel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_code_key" ON "Hostel"("code");

-- CreateIndex
CREATE INDEX "Hostel_code_idx" ON "Hostel"("code");

-- CreateIndex
CREATE INDEX "Block_hostelId_idx" ON "Block"("hostelId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_hostelId_name_key" ON "Block"("hostelId", "name");

-- CreateIndex
CREATE INDEX "Room_blockId_idx" ON "Room"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_blockId_number_key" ON "Room"("blockId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "IssueCategory_name_key" ON "IssueCategory"("name");

-- CreateIndex
CREATE INDEX "IssueCategory_name_idx" ON "IssueCategory"("name");

-- CreateIndex
CREATE INDEX "IssueStatusHistory_issueId_idx" ON "IssueStatusHistory"("issueId");

-- CreateIndex
CREATE INDEX "IssueStatusHistory_createdAt_idx" ON "IssueStatusHistory"("createdAt");

-- CreateIndex
CREATE INDEX "LostItemClaim_lostItemId_idx" ON "LostItemClaim"("lostItemId");

-- CreateIndex
CREATE INDEX "LostItemClaim_claimantId_idx" ON "LostItemClaim"("claimantId");

-- CreateIndex
CREATE INDEX "Announcement_targetHostelId_targetBlockId_idx" ON "Announcement"("targetHostelId", "targetBlockId");

-- CreateIndex
CREATE INDEX "Announcement_isPinned_priority_idx" ON "Announcement"("isPinned", "priority");

-- CreateIndex
CREATE INDEX "Comment_issueId_idx" ON "Comment"("issueId");

-- CreateIndex
CREATE INDEX "Comment_announcementId_idx" ON "Comment"("announcementId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Issue_status_visibility_idx" ON "Issue"("status", "visibility");

-- CreateIndex
CREATE INDEX "Issue_hostelId_status_idx" ON "Issue"("hostelId", "status");

-- CreateIndex
CREATE INDEX "Issue_categoryId_idx" ON "Issue"("categoryId");

-- CreateIndex
CREATE INDEX "Issue_reporterId_idx" ON "Issue"("reporterId");

-- CreateIndex
CREATE INDEX "Issue_createdAt_idx" ON "Issue"("createdAt");

-- CreateIndex
CREATE INDEX "LostItem_status_idx" ON "LostItem"("status");

-- CreateIndex
CREATE INDEX "LostItem_hostelId_idx" ON "LostItem"("hostelId");

-- CreateIndex
CREATE INDEX "LostItem_date_idx" ON "LostItem"("date");

-- CreateIndex
CREATE INDEX "Upvote_userId_idx" ON "Upvote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_commentId_userId_key" ON "Upvote"("commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_announcementId_userId_key" ON "Upvote"("announcementId", "userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_hostelId_blockId_roomId_idx" ON "User"("hostelId", "blockId", "roomId");

-- CreateIndex
CREATE INDEX "User_specialization_idx" ON "User"("specialization");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IssueCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueStatusHistory" ADD CONSTRAINT "IssueStatusHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueStatusHistory" ADD CONSTRAINT "IssueStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "LostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_targetHostelId_fkey" FOREIGN KEY ("targetHostelId") REFERENCES "Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_targetBlockId_fkey" FOREIGN KEY ("targetBlockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItemClaim" ADD CONSTRAINT "LostItemClaim_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "LostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItemClaim" ADD CONSTRAINT "LostItemClaim_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
