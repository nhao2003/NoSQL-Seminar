module.exports = async (prisma, teacherId) => {
  const start = new Date();
  const courseCount = await prisma.$queryRaw`
  SELECT COUNT(*) AS course_count
  FROM teacher_course
  WHERE teacher_id = ${teacherId}
  `;
  const end = new Date();

  return {
    time: `${end - start} ms`,
    data: courseCount,
  };
};
