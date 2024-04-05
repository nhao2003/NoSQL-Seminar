const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const sqlDemo = require("./sql");
const url = "mongodb://localhost:27017";
const dbName = "nosql";
const mongoDemo = require("./mongo");
const client = new MongoClient(url);
const prisma = new PrismaClient();
const db = client.db(dbName);

async function compareCountTeachersPerSchool() {
  const start = new Date();
  const postgreSQL = await prisma.$queryRaw`SELECT school_id, COUNT(teacher_id) FROM school_teacher GROUP BY school_id;`;
  const end = new Date();
  const mongoStart = new Date();
  const mongodb = await db.collection("school_teacher").aggregate([
    {
      $group: {
        _id: "$school_id",
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  const mongoEnd = new Date();
  console.table(postgreSQL);
  console.table(mongodb);
  return {
    Task: "Count teachers per school",
    PostgreSQL: end - start + " ms",
    Mongodb: mongoEnd - mongoStart + " ms",
  };
}

const compaGetAllUserCourse = async () => {
  const start = new Date();
  const postgreSQL = await prisma.$queryRaw`SELECT * FROM user_course;`;
  const end = new Date();
  const mongoStart = new Date();
  const mongodb = await db.collection("user_course").find().toArray();
  const mongoEnd = new Date();
  return {
    Task: "Get all user course",
    PostgreSQL: end - start + " ms",
    Mongodb: mongoEnd - mongoStart + " ms",
  };
}

const compareAllCourseOfAUser = async () => {
  const user_id = 'U_9330112';
  const start = new Date();
  const postgreSQL = await prisma.$queryRaw`SELECT  course_id FROM user_course WHERE user_id = ${user_id};`;
  const end = new Date();
  const mongoStart = new Date();
  const mongodb = await db.collection("user_course").find({ user_id }).toArray();
  const mongoEnd = new Date();
  return {
    Task: "Get all courses of a user",
    PostgreSQL: end - start + " ms",
    Mongodb: mongoEnd - mongoStart + " ms",
  };
}

async function compareGetAllSchools() {
  const postgreSQL = await sqlDemo.getAllSchools(prisma);
  const mongodb = await mongoDemo.getAllSchools(db);
  return {
    Task: "Get all schools",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareListAllCoursesASpecificUserIsEnrolledInJS() {
  const id = "U_10000060";
  const postgreSQL = await sqlDemo.ListAllCoursesASpecificUserIsEnrolledInJS(
    prisma,
    id
  );
  const mongodb = await mongoDemo.getAllCoursesUserEnrolled(db, id);
  return {
    Task: "List all courses a specific user is enrolled in",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareGetUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange() {
  const courseId = "C_10000001";
  const startDate = "2020-01-01";
  const endDate = "2020-12-31";
  const postgreSQL =
    await sqlDemo.getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange(
      prisma,
      courseId,
      new Date(startDate),
      new Date(endDate)
    );
  const mongodb = await mongoDemo.getUserInSpecificCourse(
    db,
    courseId,
    startDate,
    endDate
  );
  return {
    Task: "Get users who enrolled in a specific course during a given time range",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareGetAllTeachersForAParticularCourse() {
  const courseId = "C_course-v1:SPI+20170828001x+sp";
  const postgreSQL = await sqlDemo.getAllTeachersForAParticularCourse(
    prisma,
    courseId
  );
  const mongodb = await mongoDemo.getTeachersOfCourse(db, courseId);

  return {
    Task: "Get all teachers for a particular course",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareFindTheMostPopularCourseWithinASpecificSchool() {
  const schoolId = "S_10000001";
  const postgreSQL =
    await sqlDemo.findTheMostPopularCourseWithinASpecificSchool(
      prisma,
      schoolId
    );
  const mongodb = await mongoDemo.getTheMostPopularCourseOfSchool(db, schoolId);
  return {
    Task: "Find the most popular course within a specific school",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareFindMonthlyEnrollmentTrendsOverAYear() {
  const postgreSQL = await sqlDemo.findMonthlyEnrollmentTrendsOverAYear(prisma);
  const mongodb = await mongoDemo.findMonthlyEnrollmentTrends(db);
  return {
    Task: "Find monthly enrollment trends over a year",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareGetTop5MostEnrolledCoursesDuringTheCurrentMonth() {
  const month = 7;
  const year = 2019;
  const postgreSQL =
    await sqlDemo.getTop5MostEnrolledCoursesDuringTheCurrentMonth(
      prisma,
      month,
      year
    );
  const mongodb = await mongoDemo.get5MostEnrolledCourses(db, month, year);
  return {
    Task: "Get top 5 most enrolled courses during the current month",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}
async function compareGetTheCountOfCoursesASpecificTeacherTeach() {
  const teacherId = "T_于歆杰";
  const postgreSQL = await sqlDemo.getTheCountOfCoursesASpecificTeacherTeach(
    prisma,
    teacherId
  );
  const mongodb = await mongoDemo.getCountCourseOfTeacher(db, teacherId);
  return {
    Task: "Get the count of courses a specific teacher teach",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareGetAllCoursesOfferedByAParticularSchool() {
  const schoolId = "S_ACCA";
  const postgreSQL = await sqlDemo.getAllCoursesOfferedByAParticularSchool(
    prisma,
    schoolId
  );
  const mongodb = await mongoDemo.getCourseOfferedBySchool(db, schoolId);
  return {
    Task: "Get all courses offered by a particular school",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function main() {
  await client.connect();
  await prisma.$connect();

  // console.log("Connected successfully to server");
  // const arr = await Promise.all([
  //   await compareGetAllSchools(),
  //   await compareListAllCoursesASpecificUserIsEnrolledInJS(),
  //   await compareGetUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange(),
  //   await compareGetAllTeachersForAParticularCourse(),
  //   await compareFindTheMostPopularCourseWithinASpecificSchool(),
  //   await compareFindMonthlyEnrollmentTrendsOverAYear(),
  //   await compareGetTop5MostEnrolledCoursesDuringTheCurrentMonth(),
  //   await compareGetTheCountOfCoursesASpecificTeacherTeach(),
  //   await compareGetAllCoursesOfferedByAParticularSchool(),
  // ]);
  // console.table(arr);
  const countTeachersPerSchool = await compareAllCourseOfAUser();
  const getAllUserCourse = await compaGetAllUserCourse();
  console.table(countTeachersPerSchool);
  console.table(getAllUserCourse);
  await client.close();
  await prisma.$disconnect();
}
main().catch(console.error);
