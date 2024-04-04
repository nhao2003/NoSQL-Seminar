module.exports = async (prisma, userId) => {
  const prismaStart = new Date();

  const enrolledCourses =
    await prisma.$queryRaw`SELECT * FROM user_course WHERE user_id = ${userId}`;

  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: enrolledCourses.UserCourse,
  };
};
