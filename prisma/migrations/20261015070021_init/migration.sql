-- CreateTable
CREATE TABLE "I18nString" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "I18nString_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "ietf_tag" TEXT NOT NULL,
    "two_char_code" TEXT,
    "three_char_code" TEXT,
    "name_id" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "value" TEXT NOT NULL,
    "string_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("string_id","language_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "first_name_id" INTEGER NOT NULL,
    "last_name_id" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_ietf_tag_key" ON "Language"("ietf_tag");

-- CreateIndex
CREATE UNIQUE INDEX "Language_two_char_code_key" ON "Language"("two_char_code");

-- CreateIndex
CREATE UNIQUE INDEX "Language_three_char_code_key" ON "Language"("three_char_code");

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_string_id_fkey" FOREIGN KEY ("string_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_first_name_id_fkey" FOREIGN KEY ("first_name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_last_name_id_fkey" FOREIGN KEY ("last_name_id") REFERENCES "I18nString"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
