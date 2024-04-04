module.exports = async (prisma, courseId) => {
  const prismaStart = new Date();
  const teachers =
    await prisma.$queryRaw`SELECT * FROM teachers JOIN teacher_course ON teachers._id = teacher_course.teacher_id WHERE course_id = ${courseId}`;
  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: teachers,
  };
};
