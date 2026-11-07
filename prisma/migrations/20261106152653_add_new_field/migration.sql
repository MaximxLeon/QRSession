/*
  Warnings:

  - Added the required column `lessonType` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('LECTURE', 'PRACTICE', 'LAB', 'COURSE_WORK', 'EXAM', 'CREDIT', 'THESIS', 'CONSULTATION', 'OTHER');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "lessonType" "LessonType" NOT NULL;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "isHead" BOOLEAN NOT NULL DEFAULT false;
