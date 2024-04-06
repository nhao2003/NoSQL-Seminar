module.exports = async (prisma, courseId, startDate, endDate) => {
  const prismaStart = new Date();

  const enrolledUsers =
    // await prisma.$queryRaw` SELECT * FROM users JOIN user_course ON users._id = user_course.user_id AND user_course.course_id = ${courseId} WHERE user_course.enroll_time BETWEEN ${startDate} AND ${endDate}`;
  await prisma.$queryRaw`SELECT * FROM user_course JOIN users ON user_course.user_id = users._id WHERE user_course.course_id = ${courseId} AND user_course.enroll_time BETWEEN ${startDate} AND ${endDate}`;
  const prismaEnd = new Date();
  const prismaTime = prismaEnd - prismaStart;
  return {
    time: `${prismaTime} ms`,
    data: enrolledUsers,
  };
};
