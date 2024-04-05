module.exports = async (prisma) => {
  const prismaStart = new Date();

  const schools = await prisma.$queryRaw`SELECT * FROM schools`;

  const prismaEnd = new Date();

  return { time: `${prismaEnd - prismaStart} ms`, data: schools };
};
