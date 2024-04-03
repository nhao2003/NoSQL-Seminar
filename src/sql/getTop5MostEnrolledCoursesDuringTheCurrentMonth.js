module.exports = async (prisma, month, year) => {
  const start = new Date();
  const topCourses = await prisma.$queryRaw`SELECT
  course_id,
  COUNT(*) AS enrollment_count
  FROM user_course
  JOIN courses ON user_course.course_id = courses._id
  WHERE
    EXTRACT(MONTH FROM enroll_time) = ${month} AND
    EXTRACT(YEAR FROM enroll_time) = ${year}
  GROUP BY course_id
  ORDER BY enrollment_count DESC LIMIT 5`;
  const end = new Date();

  return {
    time: `${end - start} ms`,
    data: topCourses,
  };
};
