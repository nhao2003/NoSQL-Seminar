const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const url = "mongodb://localhost:27017";
const dbName = "nosql";

const prisma = new PrismaClient({});
const mongo = new MongoClient(url);

const entityPath = path.join(__dirname, "..", "data", "/entities");
const relationsPath = path.join(__dirname, "..", "data", "/relations");

async function connect() {
  await Promise.all([mongo.connect(), prisma.$connect()]);
}

async function clearData() {
  console.log("Clear Prisma data");
  await Promise.all([
    prisma.schoolCourse.deleteMany(),
    prisma.schoolTeacher.deleteMany(),
    prisma.teacherCourse.deleteMany(),
    prisma.userCourse.deleteMany(),
  ]);
  await Promise.all([
    prisma.user.deleteMany(),
    prisma.course.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.school.deleteMany(),
  ]);
  console.log("Clear MongoDB data");
  await mongo.db(dbName).dropDatabase();
}
// Tính thời gian chạy
async function importData(type, func, tableName) {
  const start = new Date();
  await func;
  const end = new Date();
  return {
    type,
    tableName,
    time: end - start + "ms",
  };
}

async function importPostgresData(entityName, entityJson) {
  for (let i = 0; i < entityJson.length; i++) {
    const entity = entityJson[i];
    const id = entity._id;
    delete entity._id;
    entity.id = id;
  }

  if (entityName === "users") {
    await prisma.user.createMany({ data: entityJson });
  } else if (entityName === "courses") {
    await prisma.course.createMany({ data: entityJson });
  } else if (entityName === "teachers") {
    await prisma.teacher.createMany({ data: entityJson });
  } else if (entityName === "schools") {
    await prisma.school.createMany({ data: entityJson });
  } else if (entityName === "user-course") {
    await prisma.userCourse.createMany({ data: entityJson });
  } else if (entityName === "teacher-course") {
    await prisma.teacherCourse.createMany({ data: entityJson });
  } else if (entityName === "school-teacher") {
    await prisma.schoolTeacher.createMany({ data: entityJson });
  } else if (entityName === "school-course") {
    await prisma.schoolCourse.createMany({ data: entityJson });
  }
}
// Use connect method to connect to the server
async function main() {
  await connect();
  console.log("Connected successfully to server");
  await clearData();
  const db = mongo.db(dbName);
  const entities = fs.readdirSync(entityPath);
  const relations = fs.readdirSync(relationsPath);
  const arr = [];
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const entityData = fs.readFileSync(path.join(entityPath, entity), "utf8");
    const entityJson = JSON.parse(entityData);
    const entityName = entity.replace(".json", "");
    arr.push(
      await Promise.all([
        importData(
          "MongoDB",
          db.collection(entityName).insertMany(entityJson),
          entityName
        ),
        importData(
          "Prisma",
          importPostgresData(entityName, entityJson),
          entityName
        ),
      ])
    );
  }
  for (let i = 0; i < arr.length; i++) {
    const relation = relations[i];
    const relationData = fs.readFileSync(
      path.join(relationsPath, relation),
      "utf8"
    );
    const relationJson = JSON.parse(relationData);
    const relationName = relation.replace(".json", "");
    arr.push(
      await Promise.all([
        importData(
          "MongoDB",
          //   db.collection(relationName).insertMany(relationJson),
          (async () => {
            await db.collection(relationName).insertMany(relationJson);
            return true;
          })(),
          relationName
        ),
        importData(
          "Prisma",
          // importPostgresData(relationName, relationJson),
          (async () => {
            await importPostgresData(relationName, relationJson);
            return true;
          })(),
          relationName
        ),
      ])
    );
  }
  console.log("Import data successfully");
  console.table(arr.flat());
}

main().catch(console.error);
