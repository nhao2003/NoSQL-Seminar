-- CreateTable
CREATE TABLE "users" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "core_id" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "schools" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "school_course" (
    "school_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "school_course_pkey" PRIMARY KEY ("school_id","course_id")
);

-- CreateTable
CREATE TABLE "teacher_course" (
    "teacher_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "teacher_course_pkey" PRIMARY KEY ("teacher_id","course_id")
);

-- CreateTable
CREATE TABLE "user_course" (
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enroll_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_course_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateTable
CREATE TABLE "school_teacher" (
    "school_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,

    CONSTRAINT "school_teacher_pkey" PRIMARY KEY ("school_id","teacher_id")
);

-- AddForeignKey
ALTER TABLE "school_course" ADD CONSTRAINT "school_course_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_course" ADD CONSTRAINT "school_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_teacher" ADD CONSTRAINT "school_teacher_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_teacher" ADD CONSTRAINT "school_teacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
