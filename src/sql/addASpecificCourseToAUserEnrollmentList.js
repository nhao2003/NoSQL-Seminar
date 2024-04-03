module.exports = async (prisma, userId, courseId) => {
  const prismaStart = new Date();

  // Check if the user is already enrolled in the course
  const existingEnrollment = await prisma.userCourse.findUnique({
    where: {
      user_id_course_id: {
        user_id: userId,
        course_id: courseId,
      },
    },
  });

  if (!existingEnrollment) {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        UserCourse: {
          create: {
            course_id: courseId,
          },
        },
      },
    });
    const prismaEnd = new Date();
    return {
      time: `${prismaEnd - prismaStart} ms`,
      data: result,
    };
  } else {
    // Handle the case where the user is already enrolled in the course
    throw new Error("User is already enrolled in this course");
  }
};
