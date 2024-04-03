const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const MongGoDemo = require("./mongo");
const url = "mongodb://localhost:27017";
const dbName = "nosql";

const client = new MongoClient(url);
const prisma = new PrismaClient();
async function main() {
  await client.connect();
  await prisma.$connect();

  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const mongoDemo = new MongGoDemo(db);
  // await mongoDemo.demoCRUD();
  const data = await mongoDemo.getTheMostPopularCourseOfSchool();
  console.log(data);
  await client.close();
  await prisma.$disconnect();
}
main().catch(console.error);
