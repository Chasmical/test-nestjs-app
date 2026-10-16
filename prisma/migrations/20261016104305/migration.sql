-- CreateTable
CREATE TABLE "ProfileLink" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "text_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProfileLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyLink" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "text_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CompanyLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "title_id" INTEGER NOT NULL,
    "description_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkAchievement" (
    "id" SERIAL NOT NULL,
    "work_experience_id" INTEGER NOT NULL,
    "description_id" INTEGER NOT NULL,

    CONSTRAINT "WorkAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "text_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectExperience" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title_id" INTEGER NOT NULL,
    "description_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAchievement" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "description_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectAchievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileLink" ADD CONSTRAINT "ProfileLink_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileLink" ADD CONSTRAINT "ProfileLink_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLink" ADD CONSTRAINT "CompanyLink_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLink" ADD CONSTRAINT "CompanyLink_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAchievement" ADD CONSTRAINT "WorkAchievement_work_experience_id_fkey" FOREIGN KEY ("work_experience_id") REFERENCES "WorkExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAchievement" ADD CONSTRAINT "WorkAchievement_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExperience" ADD CONSTRAINT "ProjectExperience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExperience" ADD CONSTRAINT "ProjectExperience_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExperience" ADD CONSTRAINT "ProjectExperience_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExperience" ADD CONSTRAINT "ProjectExperience_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAchievement" ADD CONSTRAINT "ProjectAchievement_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAchievement" ADD CONSTRAINT "ProjectAchievement_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
