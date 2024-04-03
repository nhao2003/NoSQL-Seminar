// Thêm 1 course
const addOneCourse = async (db) => {
  try {
    const start = new Date();
    const newCourse = await db.collection("courses").insertOne({
      name: "Test",
      prerequisites: "Test",
      about: "Test",
    });
    const end = new Date();
    // console.log("Add one course: ", end - start, " ms");
    return {
      time: end - start + " ms",
      data: newCourse,
    };
  } catch (error) {
    console.log(error);
  }
};
//Lấy 1 course
const getOneCourse = async (db, courseId) => {
  try {
    const start = new Date();
    const data = await db.collection("courses").findOne({ _id: courseId });
    const end = new Date();
    // console.log("Get one course: ", end - start, " ms");
    return {
      time: end - start + " ms",
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
//Sửa 1 course
const updateOneCourse = async (db, courseId) => {
  try {
    const start = new Date();
    const data = await db.collection("courses").updateOne(
      { _id: courseId },
      {
        $set: {
          about:
            "Lorem ipsum dolor sit amet consectetuer adipiscing elit, sed diam nonummy nibh",
        },
      }
    );
    const end = new Date();
    // console.log("Update one course: ", end - start, " ms");
    return {
      time: end - start + " ms",
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
//Xóa 1 course
const deleteOneCourse = async (db, courseId) => {
  try {
    const start = new Date();
    await db.collection("courses").deleteOne({ _id: courseId });
    const end = new Date();
    // console.log("Delete one course: ", end - start, " ms");
    return {
      time: end - start + " ms",
      data: courseId,
    };
  } catch (error) {
    console.log(error);
  }
};
//Get all schools
const getAllSchools = async (db) => {
  try {
    const start = new Date();
    const allSchools = await db.collection("schools").find().toArray();
    const end = new Date();
    // console.log("Get all schools: ", end - start, " ms");
    return {
      time: end - start + " ms",
      data: allSchools,
    };
  } catch (error) {
    console.log(error);
  }
};
//List all courses a specific user is enrolled in
const getAllCoursesUserEnrolled = async (db, userId) => {
  try {
    const start = new Date();
    const user = await db.collection("users").findOne({ _id: userId });
    const courses = await db
      .collection("courses")
      .find({ _id: { $in: user.course_order } })
      .toArray();
    //console.log(courses);
    const end = new Date();
    // console.log(
    //   "List all courses a specific user is enrolled in: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data: courses,
    };
  } catch (error) {
    console.log(error);
  }
};
//Get users who enrolled in a specific course during a given time range.
const getUserInSpecificCourse = async (db, courseId, timeStart, timeEnd) => {
  try {
    const start = new Date();
    const users = await db
      .collection("users")
      .aggregate([
        {
          $project: {
            user_id: 1,
            name: 1,
            course_order: 1,
            enroll_time: 1,
            matchingIndex: {
              $indexOfArray: ["$course_order", courseId],
            },
          },
        },
        {
          $match: {
            matchingIndex: { $ne: -1 },
          },
        },
        {
          $project: {
            user_id: 1,
            name: 1,
            enrollTime: { $arrayElemAt: ["$enroll_time", "$matchingIndex"] },
          },
        },
        {
          $match: {
            enrollTime: {
              $gte: timeStart,
              $lte: timeEnd,
            },
          },
        },
      ])
      .toArray();
    //console.log(users);
    const end = new Date();
    // console.log(
    //   "Get users who enrolled in a specific course during a given time range: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data: users,
    };
  } catch (error) {
    console.log(error);
  }
};
//List of teachers for a particular course
const getTeachersOfCourse = async (db, courseId) => {
  try {
    const start = new Date();
    const teachers = await db
      .collection("teacher-course")
      .aggregate([
        {
          $match: { course_id: courseId },
        },
        {
          $lookup: {
            from: "teachers",
            localField: "teacher_id",
            foreignField: "_id",
            as: "teachers",
          },
        },
        {
          $unwind: "$teachers",
        },
        {
          $project: {
            _id: "$teachers._id",
            name: "$teachers.name",
            about: "$teachers.about",
          },
        },
      ])
      .toArray();
    const end = new Date();
    //console.log(teachers);
    // console.log(
    //   "List of teachers for a particular course: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data: teachers,
    };
  } catch (error) {
    console.log(error);
  }
};
//List Courses offered by a particular school
const getCourseOfferedBySchool = async (db, schoolId) => {
  try {
    const start = new Date();
    const courses = await db
      .collection("school-course")
      .aggregate([
        {
          $match: { school_id: schoolId },
        },
        {
          $lookup: {
            from: "courses",
            localField: "course_id",
            foreignField: "_id",
            as: "courses",
          },
        },
        {
          $unwind: "$courses",
        },
        {
          $project: {
            _id: "$courses._id",
            school_id: "$courses.school_id",
            prerequisites: "$courses.prerequisites",
            about: "$courses.about",
          },
        },
      ])
      .toArray();
    //console.log(courses.length);
    const end = new Date();
    // console.log(
    //   "List Courses offered by a particular school: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data: courses,
    };
  } catch (error) {
    console.log(error);
  }
};
//Add a specific course to a user's enrollment list
const addCourseToUser = async (db, courseId, userId) => {
  try {
    const start = new Date();
    const data = await db.collection("user-course").insertOne({
      user_id: userId,
      course_id: courseId,
    });
    await db.collection("users").updateOne(
      { _id: userId },
      {
        $push: {
          course_order: courseId,
          enroll_time: new Date().toISOString(),
        },
      }
    );
    const end = new Date();
    // console.log(
    //   "Add a specific course to a user's enrollment list: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
//Get the count of courses a specific teacher teach
const getCountCourseOfTeacher = async (db, teacherId) => {
  try {
    const start = new Date();
    const data = await db
      .collection("teacher-course")
      .aggregate([
        { $match: { teacher_id: teacherId } },
        { $group: { _id: "$teacher_id", count: { $sum: 1 } } },
      ])
      .toArray();
    const end = new Date();
    //console.log(data);
    // console.log(
    //   "Get the count of courses a specific teacher teach: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
//List the top 5 most enrolled courses during the current month
function getCurrentMonthRange() {
  // Get current date
  const currentDate = new Date();

  // Start of the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const formattedStartOfMonth = new Date(
    startOfMonth.getTime() - startOfMonth.getTimezoneOffset() * 60000
  ).toISOString();

  // End of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const formattedLastDayOfMonth = new Date(
    lastDayOfMonth.getTime() + lastDayOfMonth.getTimezoneOffset() * 60000
  ).toISOString();

  return {
    startOfMonth: formattedStartOfMonth,
    endOfMonth: formattedLastDayOfMonth,
  };
}
const get5MostEnrolledCourses = async (db) => {
  try {
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();
    const start = new Date();
    const top5Courses = await db
      .collection("users")
      .aggregate([
        {
          $unwind: {
            path: "$course_order",
            includeArrayIndex: "index",
          },
        },
        {
          $project: {
            course_id: "$course_order",
            enroll_time: { $arrayElemAt: ["$enroll_time", "$index"] },
          },
        },
        {
          $match: {
            enroll_time: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: "$course_id",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();
    const end = new Date();
    //console.log(top5Courses);
    // console.log(
    //   "List the top 5 most enrolled courses during the current month: ",
    //   end - start,
    //   " ms"
    // );
    return {
      time: end - start + " ms",
      data: top5Courses,
    };
  } catch (error) {
    console.log(error);
  }
};
//Find the most popular course within a specific school
const getMostPopularCourseOfSchool = async (db, schoolId) => {
  try {
    const start = new Date();
    const courseOfSchool = (
      await db
        .collection("school-course")
        .aggregate([
          {
            $match: { school_id: schoolId },
          },
          {
            $project: { _id: 0, course_id: 1 }, // Project only the course_id field
          },
        ])
        .toArray()
    ).map((el) => el.course_id);
    const mostPopularCourse = await db
      .collection("user-course")
      .aggregate([
        { $match: { course_id: { $in: courseOfSchool } } },
        { $group: { _id: "$course_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          $limit: 1,
        },
      ])
      .toArray();
    //console.log(mostPopularCourse);
    const end = new Date();
    console.log(
      "Find the most popular course within a specific school: ",
      end - start,
      " ms"
    );
    return {
      time: end - start + " ms",
      data: mostPopularCourse,
    };
  } catch (error) {
    console.log(error);
  }
};
//Find Monthly enrollment trends over a year
const findMonthlyEnrollmentTrends = async (db) => {
  try {
    const startDate = "2017-01-01T00:00:00.000Z";
    const endDate = "2017-12-31T23:59:59.999Z";
    const start = new Date();
    const monthlyEnrollments = await db
      .collection("users")
      .aggregate([
        {
          $unwind: "$enroll_time",
        },
        {
          $match: {
            enroll_time: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $addFields: {
            enroll_date: { $toDate: "$enroll_time" },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$enroll_date" },
              year: { $year: "$enroll_date" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    const end = new Date();
    //console.log(monthlyEnrollments);
    console.log(
      "Find Monthly enrollment trends over a year: ",
      end - start,
      " ms"
    );
    // return monthlyEnrollments;
    return {
      time: end - start + " ms",
      data: monthlyEnrollments,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
// await getAllSchools(db);
// await getAllCoursesUserEnrolled(db, "U_7001215");
// await getUserInSpecificCourse(
//   db,
//   "C_course-v1:TsinghuaX+00740043_2x_2015_T2+sp",
//   "2017-04-26T04:09:21.000Z",
//   "2017-05-3T04:09:21.000Z"
// );
// await getTeachersOfCourse(db, "C_course-v1:TsinghuaX+00740043_2x_2015_T2+sp");
// await getCourseOfferedBySchool(db, "S_BNU");
// await addCourseToUser(
//   db,
//   "C_course-v1:McGillX+ATOC185x+2015_T1",
//   "U_7001215"
// );
// await getCountCourseOfTeacher(db, "T_方维奇");
// await get5MostEnrolledCourses(db);
// await getMostPopularCourseOfSchool(db, "S_BNU");
// await findMonthlyEnrollmentTrends(db);
class MongGoDemo {
  constructor(db) {
    this.db = db;
  }

  async demoCRUD() {
    const data = await addOneCourse(this.db);
    console.log("Add one course: ", data.time);
    const newCourseId = data.data.insertedId;
    const getOneCourseData = await getOneCourse(this.db, newCourseId);
    console.log("Get one course: ", getOneCourseData.time);
    const updateOneCourseData = await updateOneCourse(this.db, newCourseId);
    console.log("Update one course: ", updateOneCourseData.time);
    const deleteOneCourseData = await deleteOneCourse(this.db, newCourseId);
    console.log("Delete one course: ", deleteOneCourseData.time);
  }

  async getAllSchools() {
    return await getAllSchools(this.db);
  }

  async getAllCoursesUserEnrolled() {
    return await getAllCoursesUserEnrolled(this.db, "U_7001215");
  }

  async getUserInSpecificCourse() {
    return await getUserInSpecificCourse(
      this.db,
      "C_course-v1:TsinghuaX+00740043_2x_2015_T2+sp",
      "2017-04-26T04:09:21.000Z",
      "2017-05-3T04:09:21.000Z"
    );
  }

  async getTeachersOfCourse() {
    return await getTeachersOfCourse(
      this.db,
      "C_course-v1:TsinghuaX+00740043_2x_2015_T2+sp"
    );
  }

  async getCourseOfferedBySchool() {
    return await getCourseOfferedBySchool(this.db, "S_BNU");
  }

  async addCourseToUser() {
    return await addCourseToUser(
      this.db,
      "C_course-v1:McGillX+ATOC185x+2015_T1",
      "U_7001215"
    );
  }

  async getCountCourseOfTeacher() {
    return await getCountCourseOfTeacher(this.db, "T_方维奇");
  }

  async get5MostEnrolledCourses() {
    return await get5MostEnrolledCourses(this.db);
  }

  async getMostPopularCourseOfSchool() {
    return await getMostPopularCourseOfSchool(this.db, "S_BNU");
  }

  async findMonthlyEnrollmentTrends() {
    return await findMonthlyEnrollmentTrends(this.db);
  }
}

module.exports = MongGoDemo;
