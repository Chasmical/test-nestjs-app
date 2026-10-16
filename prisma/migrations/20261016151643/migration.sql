/*
  Warnings:

  - You are about to drop the column `three_char_code` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `two_char_code` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `ProjectAchievement` table. All the data in the column will be lost.
  - Added the required column `description_id` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_experience_id` to the `ProjectAchievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `ProjectExperience` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectAchievement" DROP CONSTRAINT "ProjectAchievement_project_id_fkey";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "three_char_code",
DROP COLUMN "two_char_code";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "description_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectAchievement" DROP COLUMN "project_id",
ADD COLUMN     "project_experience_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectExperience" ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAchievement" ADD CONSTRAINT "ProjectAchievement_project_experience_id_fkey" FOREIGN KEY ("project_experience_id") REFERENCES "ProjectExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
