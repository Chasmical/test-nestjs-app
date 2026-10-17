/*
  Warnings:

  - You are about to drop the column `description_id` on the `ProjectExperience` table. All the data in the column will be lost.
  - You are about to drop the column `description_id` on the `WorkExperience` table. All the data in the column will be lost.
  - Added the required column `description_id` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectExperience" DROP CONSTRAINT "ProjectExperience_description_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectExperience" DROP CONSTRAINT "ProjectExperience_title_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_description_id_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "description_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectExperience" DROP COLUMN "description_id",
ALTER COLUMN "title_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkExperience" DROP COLUMN "description_id";

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExperience" ADD CONSTRAINT "ProjectExperience_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "I18nString"("id") ON DELETE SET NULL ON UPDATE CASCADE;
