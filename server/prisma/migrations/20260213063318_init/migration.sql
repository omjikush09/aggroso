-- CreateTable
CREATE TABLE "ProjectSpec" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goal" TEXT NOT NULL,
    "users" TEXT NOT NULL,
    "constraints" TEXT,
    "template" TEXT NOT NULL,

    CONSTRAINT "ProjectSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "specId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("specId","id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "specId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("specId","id")
);

-- CreateIndex
CREATE INDEX "stories_specId_position_idx" ON "stories"("specId", "position");

-- CreateIndex
CREATE INDEX "tasks_specId_position_idx" ON "tasks"("specId", "position");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_specId_fkey" FOREIGN KEY ("specId") REFERENCES "ProjectSpec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_specId_fkey" FOREIGN KEY ("specId") REFERENCES "ProjectSpec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
