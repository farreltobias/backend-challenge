-- DropForeignKey
ALTER TABLE "submission" DROP CONSTRAINT "submission_challengeId_fkey";

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
