module.exports = async (prisma, year) => {
  const start = new Date();
  const monthlyEnrollmentTrends = await prisma.$queryRaw`
  SELECT
    EXTRACT(MONTH FROM enroll_time) AS month,
    COUNT(*) AS enrollment_count
  FROM user_course
  WHERE EXTRACT(YEAR FROM enroll_time) = ${year}
  GROUP BY month
  ORDER BY month
  `;
  const end = new Date();

  return {
    time: `${end - start}ms`,
    data: monthlyEnrollmentTrends,
  };
};
