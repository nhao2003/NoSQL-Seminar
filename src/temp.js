const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const getAllSchools = require("./sql/getAllSchools");
const ListAllCoursesASpecificUserIsEnrolledInJS = require("./sql/listAllCoursesASpecificUserIsEnrolledIn.js");
const getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange = require("./sql/getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange");
const getAllTeachersForAParticularCourse = require("./sql/getAllTeachersForAParticularCourse.js");
const findTheMostPopularCourseWithinASpecificSchool = require("./sql/findTheMostPopularCourseWithinASpecificSchool.js");
const findMonthlyEnrollmentTrendsOverAYear = require("./sql/findMonthlyEnrollmentTrendsOverAYear.js");
const getTop5MostEnrolledCoursesDuringTheCurrentMonth = require("./sql/getTop5MostEnrolledCoursesDuringTheCurrentMonth.js");
const getTheCountOfCoursesASpecificTeacherTeach = require("./sql/getTheCountOfCoursesASpecificTeacherTeach.js");
const addASpecificCourseToAUserEnrollmentList = require("./sql/addASpecificCourseToAUserEnrollmentList.js");
const getAllCoursesOfferedByAParticularSchool = require("./sql/getAllCoursesOfferedByAParticularSchool.js");

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
  // const result2 = await ListAllCoursesASpecificUserIsEnrolledInJS(
  //   prisma,
  //   userId
  // );
  // console.log(result2);

  // 3. Get users who enrolled in a specific course during a given time range**
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
  // console.log(result3);

  // // 4. Get all teachers for a particular course
  // const courseId = "C_course-v1:HUBU+20170227X+2019_T1";
  // const result4 = await getAllTeachersForAParticularCourse(prisma, courseId);
  // console.log({ result4 });

  // // 5. Get all courses offered by a particular school
  // const schoolId = "S_ACCA";
  // const result5 = await getAllCoursesOfferedByAParticularSchool(
  //   prisma,
  //   schoolId
  // );
  // console.log({ result5 });

  // // 6. Add a specific course to a user's enrollment list
  // const userId = "U_10000060";
  // const courseId = "C_course-v1:ACCA+FA1_X_en+2019_T1";
  // const result6 = await addASpecificCourseToAUserEnrollmentList(
  //   prisma,
  //   userId,
  //   courseId
  // );
  // console.log({ result6 });

  // // 7. Get the count of courses a specific teacher teach
  // const teacherId = "T_于歆杰";
  // const result7 = await getTheCountOfCoursesASpecificTeacherTeach(
  //   prisma,
  //   teacherId
  // );
  // console.log({ result7 });

  // 8. Get top 5 most enrolled courses during the current month
  // const month = 7;
  // const year = 2019;
  // const result8 = await getTop5MostEnrolledCoursesDuringTheCurrentMonth(
  //   prisma,
  //   month,
  //   year
  // );

  // console.log({ res: result8.data });

  // // 9. Find the most popular course within a specific school
  // const result9 = await findTheMostPopularCourseWithinASpecificSchool(
  //   prisma,
  //   "S_ACCA"
  // );
  // console.log({ result9 });

  // // 10. Find Monthly enrollment trends over a year
  // const result10 = await findMonthlyEnrollmentTrendsOverAYear(prisma, 2019);
  // console.log({ result10 });

  await prisma.$disconnect();
}

main().catch(console.error);
