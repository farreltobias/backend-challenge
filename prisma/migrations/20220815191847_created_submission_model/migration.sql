-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'ERROR', 'DONE');

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "grade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
