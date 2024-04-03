module.exports = async (prisma) => {
  const prismaStart = new Date();

  const schools = await prisma.school.findMany();

  const prismaEnd = new Date();

  return { time: `${prismaEnd - prismaStart} ms`, data: schools };
};
