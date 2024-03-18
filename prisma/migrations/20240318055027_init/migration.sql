-- CreateTable
CREATE TABLE "Stopwatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3),
    "hour" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "seconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stopwatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stopwatch" ADD CONSTRAINT "Stopwatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
