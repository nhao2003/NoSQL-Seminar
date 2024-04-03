module.exports = async (prisma, teacherId) => {
  const start = new Date();
  const courseCount = await prisma.teacherCourse.count({
    where: { teacher_id: teacherId },
  });
  const end = new Date();

  return {
    time: `${end - start} ms`,
    data: courseCount,
  };
};
