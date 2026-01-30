-- AlterTable
ALTER TABLE "LostItemClaim" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "proofUrls" SET DEFAULT ARRAY[]::TEXT[];
