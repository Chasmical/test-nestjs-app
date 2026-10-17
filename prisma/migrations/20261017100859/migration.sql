-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSkill" (
    "work_experience_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "WorkSkill_pkey" PRIMARY KEY ("work_experience_id","skill_id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "project_experience_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("project_experience_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSkill" ADD CONSTRAINT "WorkSkill_work_experience_id_fkey" FOREIGN KEY ("work_experience_id") REFERENCES "WorkExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSkill" ADD CONSTRAINT "WorkSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_project_experience_id_fkey" FOREIGN KEY ("project_experience_id") REFERENCES "ProjectExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
