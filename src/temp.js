const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const getAllSchools = require("./sql/getAllSchools");
const ListAllCoursesASpecificUserIsEnrolledInJS = require("./sql/listAllCoursesASpecificUserIsEnrolledIn.js");
const getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange = require("./sql/getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange");
const getAllTeachersForAParticularCourse = require("./sql/getAllTeachersForAParticularCourse.js");

const prisma = new PrismaClient();
async function main() {
  await prisma.$connect();

  console.log("Connected successfully to server");

  // const prismaStart = new Date();
  // const courseEnrollsPrisma = await prisma.userCourse.groupBy({
  //   by: ["course_id"],
  //   _count: true,
  // });
  // console.log(courseEnrollsPrisma);
  // const prismaEnd = new Date();

  // console.log(
  //   courseEnrollsPrisma.reduce((acc, curr) =>
  //     acc._count > curr._count ? acc : curr
  //   )
  // );
  // console.log("Prisma", prismaEnd - prismaStart, "ms");
  // // 1. Get all schools**
  // const result1 = await getAllSchools(prisma);
  // console.log({ result1 });

  // // 2. List all courses a specific user is enrolled in
  // const userId = "U_10000060";
  // const result2 = await listAllCoursesASpecificUserIsEnrolledInJS(
  //   prisma,
  //   userId
  // );
  // console.log({ result2 });

  // // 3. Get users who enrolled in a specific course during a given time range**
  // const courseId = "C_course-v1:ACCA+FA1_X_en+2019_T1";
  // const startDate = new Date("2019-04-09");
  // const endDate = new Date("2019-09-09");
  // const result3 =
  //   await getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange(
  //     prisma,
  //     courseId,
  //     startDate,
  //     endDate
  //   );
  // console.log({ result3 });

  // // 4. Get all teachers for a particular course
  // const courseId = "C_course-v1:HUBU+20170227X+2019_T1";
  // const result4 = await getAllTeachersForAParticularCourse(prisma, courseId);
  // console.log({ result4 });

  // // 5. Get all courses offered by a particular school
  // const schoolId = "S_ACCA";
  // const courses = await prisma.schoolCourse.findMany({
  //   where: { school_id: schoolId },
  //   select: { Course: true },
  // });
  // console.log("Courses:", courses);

  // // 6. Add a specific course to a user's enrollment list
  // const userId = "U_10000060";
  // const courseId = "C_course-v1:ACCA+FA1_X_en+2019_T1";
  // const user = await prisma.user.update({
  //   where: { id: userId },
  //   data: {
  //     UserCourse: {
  //       create: {
  //         course_id: courseId,
  //         enroll_time: new Date(),
  //       },
  //     },
  //   },
  // });
  // console.log("User:", user);

  // // 7. Get the count of courses a specific teacher teach
  // const teacherId = "T_于歆杰";
  // const courseCount = await prisma.teacherCourse.count({
  //   where: { teacher_id: teacherId },
  // });
  // console.log("Course Count:", courseCount);

  // // 8. Get top 5 most enrolled courses during the current month
  // const month = 7;
  // const year = 2019;
  // const topCourses = await prisma.$queryRaw`SELECT
  // course_id,
  // COUNT(*) AS enrollment_count
  // FROM user_course
  // JOIN courses ON user_course.course_id = courses._id
  // WHERE
  //   EXTRACT(MONTH FROM enroll_time) = ${month} AND
  //   EXTRACT(YEAR FROM enroll_time) = ${year}
  // GROUP BY course_id
  // ORDER BY enrollment_count DESC LIMIT 5`;

  // console.log("Top Courses:", topCourses);

  // // 9. Find the most popular course within a specific school
  // const results = await prisma.$queryRaw`
  // SELECT
  //   sc.course_id,
  //   c.name AS course_name,
  //   COUNT(*) AS enrollment_count
  // FROM school_course sc
  // JOIN courses c ON sc.course_id = c._id
  // JOIN user_course uc ON sc.course_id = uc.course_id
  // WHERE sc.school_id = 'S_ACCA'
  // GROUP BY sc.course_id, c.name
  // ORDER BY enrollment_count DESC
  // LIMIT 1
  // `;
  // console.log("Monthly Enrollment Trends:", results);

  // // 10. Find Monthly enrollment trends over a year
  // const monthlyEnrollmentTrends = await prisma.$queryRaw`
  // SELECT
  //   EXTRACT(MONTH FROM enroll_time) AS month,
  //   COUNT(*) AS enrollment_count
  // FROM user_course
  // WHERE EXTRACT(YEAR FROM enroll_time) = 2019
  // GROUP BY month
  // ORDER BY month
  // `;
  // console.log("Monthly Enrollment Trends:", monthlyEnrollmentTrends);

  await prisma.$disconnect();
}

main().catch(console.error);
