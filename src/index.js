const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const url = "mongodb://localhost:27017";
const dbName = "nosql";

const client = new MongoClient(url);
const prisma = new PrismaClient();
async function main() {
  await client.connect();
  await prisma.$connect();

  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const start = new Date();
  const courseEnrolls = await db
    .collection("user-course")
    .aggregate([{ $group: { _id: "$course_id", views: { $sum: 1 } } }])
    .toArray();
  const end = new Date();

  const prismaStart = new Date();
  const courseEnrollsPrisma = await prisma.userCourse.groupBy({
    by: ["course_id"],
    _count: true,
  });
  const prismaEnd = new Date();
  // Max number of course enrollments
  console.log(courseEnrolls.reduce((acc, curr) => (acc.views > curr.views ? acc : curr)));
  console.log("MongoDB", end - start, "ms");
  console.log(courseEnrollsPrisma.reduce((acc, curr) => (acc._count > curr._count ? acc : curr)));
  console.log("Prisma", prismaEnd - prismaStart, "ms");
  await client.close();
  await prisma.$disconnect();
}

main().catch(console.error);
