module.exports = async (prisma, schoolId) => {
  const prismaStart = new Date();
  const courses = await prisma.schoolCourse.findMany({
    where: { school_id: schoolId },
    select: { Course: true },
  });
  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: courses,
  };
};
