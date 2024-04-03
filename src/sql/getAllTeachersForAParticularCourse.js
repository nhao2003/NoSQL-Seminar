module.exports = async (prisma, courseId) => {
  const prismaStart = new Date();
  const teachers = await prisma.teacherCourse.findMany({
    where: { course_id: courseId },
    select: { Teacher: true },
  });
  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: teachers,
  };
};
