module.exports = async (prisma, userId) => {
  const prismaStart = new Date();

  const enrolledCourses = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserCourse: {
        include: { Course: true },
      },
    },
  });

  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: enrolledCourses.UserCourse,
  };
};
