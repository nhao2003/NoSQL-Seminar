const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const sqlDemo = require("./sql");
const url = "mongodb://localhost:27017";
const dbName = "nosql";
const mongoDemo = require("./mongo");
const client = new MongoClient(url);
const prisma = new PrismaClient();
const db = client.db(dbName);
async function benchmark(func) {
  const start = new Date();
  const res = await func();
  const end = new Date();
  return {
    time: end - start + " ms",
    data: res,
  };
}

async function compareCountTeachersPerSchool() {
  const res = await Promise.all([
    benchmark(async () => {
      return await prisma.$queryRaw`SELECT school_id, COUNT(teacher_id) FROM school_teacher GROUP BY school_id;`;
    }),
    benchmark(async () => {
      return await db
        .collection("school_teacher")
        .aggregate([
          {
            $group: {
              _id: "$school_id",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();
    }),
  ]);
  return {
    Task: "Count teachers per school",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

const compaCountAllUserCourseEnroll = async () => {
  const res = await Promise.all([
    benchmark(async () => {
      return await prisma.$queryRaw`SELECT COUNT(*) FROM user_course;`;
    }),
    benchmark(async () => {
      return await db.collection("user_course").countDocuments();
    }),
  ]);
  return {
    Task: "Count all user course enroll",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
};

const compareAllCourseOfAUser = async () => {
  // const user_id = 'U_9330112';
  // const start = new Date();
  // const postgreSQL = await prisma.$queryRaw`SELECT  course_id FROM user_course WHERE user_id = ${user_id};`;
  // const end = new Date();
  // const mongoStart = new Date();
  // const mongodb = await db.collection("user_course").find({ user_id }).toArray();
  // const mongoEnd = new Date();
  // return {
  //   Task: "Get all courses of a user",
  //   PostgreSQL: end - start + " ms",
  //   Mongodb: mongoEnd - mongoStart + " ms",
  // };
  const res = await Promise.all([
    benchmark(async () => {
      return await prisma.$queryRaw`SELECT  course_id FROM user_course WHERE user_id = 'U_9330112';`;
    }),
    benchmark(async () => {
      return await db
        .collection("user_course")
        .find({ user_id: "U_9330112" })
        .toArray();
    }),
  ]);
  return {
    Task: "Get all courses of a user",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
};

async function compareGetAllSchools() {
  const res = await Promise.all([
    sqlDemo.getAllSchools(prisma),
    mongoDemo.getAllSchools(db),
  ]);
  return {
    Task: "Get all schools",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function compareListAllCoursesASpecificUserIsEnrolledInJS() {
  const id = "U_10000060";

  const res = await Promise.all([
    sqlDemo.ListAllCoursesASpecificUserIsEnrolledInJS(prisma, id),
    mongoDemo.getAllCoursesUserEnrolled(db, id),
  ]);
  return {
    Task: "List all courses a specific user is enrolled in",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function compareGetUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange() {
  const courseId = "C_course-v1:TsinghuaX+02070251X+2019_T1";
  const startDate = "2018-01-01";
  const endDate = "2020-12-31";
  const res = await Promise.all([
    sqlDemo.getUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange(
      prisma,
      courseId,
      new Date(startDate),
      new Date(endDate)
    ),
    mongoDemo.getUserInSpecificCourse(db, courseId, startDate, endDate),
  ]);
  return {
    Task: "Get users who enrolled in a specific course during a given time range",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function compareGetAllTeachersForAParticularCourse() {
  const courseId = "C_course-v1:SPI+20170828001x+sp";
  const res = await Promise.all([
    sqlDemo.getAllTeachersForAParticularCourse(prisma, courseId),
    mongoDemo.getTeachersOfCourse(db, courseId),
  ]);
  return {
    Task: "Get all teachers for a particular course",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function compareFindTheMostPopularCourseWithinASpecificSchool() {
  const schoolId = "S_10000001";
  const res = await Promise.all([
    sqlDemo.findTheMostPopularCourseWithinASpecificSchool(prisma, schoolId),
    mongoDemo.getTheMostPopularCourseOfSchool(db, schoolId),
  ]);
  return {
    Task: "Find the most popular course within a specific school",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function compareFindMonthlyEnrollmentTrendsOverAYear() {
  const postgreSQL = await sqlDemo.findMonthlyEnrollmentTrendsOverAYear(prisma, 2019);
  const mongodb = await mongoDemo.findMonthlyEnrollmentTrends(db, 2019);
  return {
    Task: "Find monthly enrollment trends over a year",
    PostgreSQL: postgreSQL.time,
    Mongodb: mongodb.time,
  };
}

async function compareGetTop5MostEnrolledCoursesDuringTheCurrentMonth() {
  const month = 7;
  const year = 2019;
  const res = await Promise.all([
    sqlDemo.getTop5MostEnrolledCoursesDuringTheCurrentMonth(
      prisma,
      month,
      year
    ),
    mongoDemo.get5MostEnrolledCourses(db, month, year),
  ]);
  return {
    Task: "Get top 5 most enrolled courses during the current month",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
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
  const res = await Promise.all([
    sqlDemo.getAllCoursesOfferedByAParticularSchool(prisma, "S_ACCA"),
    mongoDemo.getCourseOfferedBySchool(db, "S_ACCA"),
  ]);
  return {
    Task: "Get all courses offered by a particular school",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}

async function getCountStudenOfEachTeacher() {
  const res = await Promise.all([
    benchmark(async () => {
      return await prisma.$queryRaw`SELECT _id, name, about, COUNT(user_id) FROM teachers JOIN teacher_course ON teachers._id = teacher_course.teacher_id JOIN user_course ON teacher_course.course_id = user_course.course_id GROUP BY _id, name, about;`;
    }
    ),
    benchmark(async () => {
      return await db.collection("teachers").aggregate([
        {
          $lookup: {
            from: "teacher_course",
            localField: "_id",
            foreignField: "teacher_id",
            as: "teacher_course",
          },
        },
        {
          $unwind: "$teacher_course",
        },
        {
          $lookup: {
            from: "user_course",
            localField: "teacher_course.course_id",
            foreignField: "course_id",
            as: "user_course",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            about: { $first: "$about" },
            count: { $sum: 1 },
          },
        },
      ]).toArray();
    }
    ),
  ]);
  // console.log(res[0].time, res[1].time);
  // console.log(res[0].data.length, res[1].data.length);
  return {
    Task: "Get count student of each teacher",
    PostgreSQL: res[0].time,
    Mongodb: res[1].time,
  };
}
async function test() {
  const arr = await Promise.all([
    await compareAllCourseOfAUser(),
    await compaCountAllUserCourseEnroll(),
    await compareGetAllSchools(),
    await compareListAllCoursesASpecificUserIsEnrolledInJS(),
    await compareGetUsersWhoEnrolledInASpecificCourseDuringAGivenTimeRange(),
    await compareGetAllTeachersForAParticularCourse(),
    await compareFindTheMostPopularCourseWithinASpecificSchool(),
    await compareFindMonthlyEnrollmentTrendsOverAYear(),
    await compareGetTop5MostEnrolledCoursesDuringTheCurrentMonth(),
    await compareGetTheCountOfCoursesASpecificTeacherTeach(),
    await compareGetAllCoursesOfferedByAParticularSchool(),
    await getCountStudenOfEachTeacher(),
  ]);
  return arr;
}

async function main() {
  await client.connect();
  await prisma.$connect();
  const arr = [];

  for (let i = 0; i < 10; i++) {
    const result = await test();
    console.log("Iteration", i + 1);
    console.table(result);
    arr.push(result);
  }
  // Group by task. Remove ' ms' character and convert to number
  const avg = arr.reduce((acc, cur) => {
    cur.forEach((item) => {
      if (!acc[item.Task]) {
        acc[item.Task] = {
          PostgreSQL: 0,
          Mongodb: 0,
        };
      }
      acc[item.Task].PostgreSQL += Number(item.PostgreSQL.replace(" ms", ""));
      acc[item.Task].Mongodb += Number(item.Mongodb.replace(" ms", ""));
    });
    return acc;
  }, {});
  // Calculate average
  Object.keys(avg).forEach((key) => {
    avg[key].PostgreSQL /= arr.length;
    avg[key].Mongodb /= arr.length;
    avg[key].PostgreSQL += " ms";
    avg[key].Mongodb += " ms";
  });
  // To array
  const result = Object.keys(avg).map((key) => ({
    Task: key,
    PostgreSQL: avg[key].PostgreSQL,
    Mongodb: avg[key].Mongodb,
  }));
  console.log("Average");
  console.table(result);
  await client.close();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});