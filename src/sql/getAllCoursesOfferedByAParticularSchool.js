module.exports = async (prisma, schoolId) => {
  const prismaStart = new Date();
  const courses =
    await prisma.$queryRaw`SELECT * FROM courses JOIN school_course ON courses._id = school_course.course_id WHERE school_id = ${schoolId}`;
  const prismaEnd = new Date();

  return {
    time: `${prismaEnd - prismaStart} ms`,
    data: courses,
  };
};
