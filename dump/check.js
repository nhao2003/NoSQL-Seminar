const fs = require("fs");
const path = require("path");
const entityPath = path.join(__dirname, "data", "/entities");
const relationsPath = path.join(__dirname, "data", "/relations");
const entities = fs.readdirSync(entityPath);
const relations = fs.readdirSync(relationsPath);
async function checkSchoolCourse() {
  const courses = JSON.parse(
    fs.readFileSync(path.join(entityPath, "courses.json"), "utf8")
  );

  const schools = JSON.parse(
    fs.readFileSync(path.join(entityPath, "schools.json"), "utf8")
  );
  const schoolCourses = JSON.parse(
    fs.readFileSync(path.join(relationsPath, "school-course.json"), "utf8")
  );

  // Check schoolCourses is has schoolId and courseId in schools and courses
  // If not, print it out
  schoolCourses.forEach((schoolCourse) => {
    const schoolId = schoolCourse.school_id;
    const courseId = schoolCourse.course_id;
    if (!schools.find((school) => school._id === schoolId)) {
      console.log(`SchoolId ${schoolId} not found`);
    }
    if (!courses.find((course) => course._id === courseId)) {
      console.log(`CourseId ${courseId} not found`);
    }
  });
}

function checkTeacherCourse() {
  const teachers = JSON.parse(
    fs.readFileSync(path.join(entityPath, "teachers.json"), "utf8")
  );
  const courses = JSON.parse(
    fs.readFileSync(path.join(entityPath, "courses.json"), "utf8")
  );
  const teacherCourses = JSON.parse(
    fs.readFileSync(path.join(relationsPath, "teacher-course.json"), "utf8")
  );

  // Check teacherCourses is has teacherId and courseId in teachers and courses
  // If not, print it out
  teacherCourses.forEach((teacherCourse) => {
    const teacherId = teacherCourse.teacher_id;
    const courseId = teacherCourse.course_id;
    if (!teachers.find((teacher) => teacher._id === teacherId)) {
      console.log(`TeacherId ${teacherId} not found`);
    }
    if (!courses.find((course) => course._id === courseId)) {
      console.log(`CourseId ${courseId} not found`);
    }
  });

  const newTeacherCourses = teacherCourses.filter((teacherCourse) => {
    const teacherId = teacherCourse.teacher_id;
    const courseId = teacherCourse.course_id;
    return (
      teachers.find((teacher) => teacher._id === teacherId) &&
      courses.find((course) => course._id === courseId)
    );
  });

  fs.writeFileSync(
    path.join(relationsPath, "teacher-course.json"),
    JSON.stringify(newTeacherCourses, null, 2)
  );
}

function checkUserCourse() {
  const users = JSON.parse(
    fs.readFileSync(path.join(entityPath, "users.json"), "utf8")
  );
  const courses = JSON.parse(
    fs.readFileSync(path.join(entityPath, "courses.json"), "utf8")
  );
  const userCourses = JSON.parse(
    fs.readFileSync(path.join(relationsPath, "user-course.json"), "utf8")
  );

  const mapUserIds = users.map((user) => user._id);
  const mapCourseIds = courses.map((course) => course._id);
  userCourses.forEach((userCourse) => {
    if (!mapUserIds.includes(userCourse.user_id)) {
      console.log(`UserId ${userCourse.user_id} not found`);
    }
    if (!mapCourseIds.includes(userCourse.course_id)) {
      console.log(`CourseId ${userCourse.course_id} not found`);
    }
  });

  // const newUserCourses = userCourses.filter((userCourse) => {
  //     const userId = userCourse.user_id;
  //     const courseId = userCourse.course_id;
  //     return users.find((user) => user._id === userId) && courses.find((course) => course._id === courseId);
  // }
  // );

  // fs.writeFileSync(path.join(relationsPath, "user-course.json"), JSON.stringify(newUserCourses, null, 2));
}

function checkSchoolTeacher() {
  const schools = JSON.parse(
    fs.readFileSync(path.join(entityPath, "schools.json"), "utf8")
  );
  const teachers = JSON.parse(
    fs.readFileSync(path.join(entityPath, "teachers.json"), "utf8")
  );
  const schoolTeachers = JSON.parse(
    fs.readFileSync(path.join(relationsPath, "school-teacher.json"), "utf8")
  );

  const mapSchoolIds = schools.map((school) => school._id);
  const mapTeacherIds = teachers.map((teacher) => teacher._id);
  schoolTeachers.forEach((schoolTeacher) => {
    if (!mapSchoolIds.includes(schoolTeacher.school_id)) {
      console.log(`SchoolId ${schoolTeacher.school_id} not found`);
    }
    if (!mapTeacherIds.includes(schoolTeacher.teacher_id)) {
      console.log(`TeacherId ${schoolTeacher.teacher_id} not found`);
    }
  });

  // Check duplicate schoolTeacher

  const mapSchoolTeacher = {};
  schoolTeachers.forEach((schoolTeacher) => {
    const key = `${schoolTeacher.school_id}-${schoolTeacher.teacher_id}`;
    if (mapSchoolTeacher[key]) {
      console.log(`Duplicate schoolTeacher ${key}`);
    }
    mapSchoolTeacher[key] = mapSchoolTeacher[key]
      ? mapSchoolTeacher[key] + 1
      : 1;
  });

  const newSchoolTeachers = schoolTeachers.filter((schoolTeacher) => {
    const schoolId = schoolTeacher.school_id;
    const teacherId = schoolTeacher.teacher_id;
    return (
      schools.find((school) => school._id === schoolId) &&
      teachers.find((teacher) => teacher._id === teacherId) &&
      mapSchoolTeacher[`${schoolId}-${teacherId}`] === 1
    );
  });
  console.log(schoolTeachers.length);
  console.log(newSchoolTeachers.length);

  fs.writeFileSync(path.join(relationsPath, "school-teacher.json"), JSON.stringify(newSchoolTeachers, null, 2));
}

checkSchoolTeacher();
