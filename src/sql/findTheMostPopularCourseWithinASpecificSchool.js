module.exports = async (prisma, schoolId) => {
  const start = new Date();
  const results = await prisma.$queryRaw`
  SELECT
    s.name AS school_name,
    sc.course_id,
    c.name AS course_name,
    COUNT(*) AS enrollment_count
  FROM school_course sc
  JOIN schools s ON sc.school_id = s._id
  JOIN courses c ON sc.course_id = c._id
  JOIN user_course uc ON sc.course_id = uc.course_id
  WHERE sc.school_id = ${schoolId}
  GROUP BY sc.course_id, c.name, s.name
  ORDER BY enrollment_count DESC
  LIMIT 1
  `;
  const end = new Date();

  return {
    time: `${end - start} ms`,
    data: results,
  };
};
