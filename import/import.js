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
  try {
    await func;
  } catch (error) {
    console.log("Error: ", tableName);
    return;
  }
  const end = new Date();
  return {
    type,
    tableName,
    time: end - start + "ms",
  };
}

async function importPostgresData(entityName, entityJson) {
  try {
    if (entityName === "users") {
      await prisma.user.createMany({ data: entityJson });
    } else if (entityName === "courses") {
      await prisma.course.createMany({ data: entityJson });
    } else if (entityName === "teachers") {
      await prisma.teacher.createMany({ data: entityJson });
    } else if (entityName === "schools") {
      await prisma.school.createMany({ data: entityJson });
    } else if (entityName === "user_course") {
      await prisma.userCourse.createMany({ data: entityJson });
    } else if (entityName === "teacher_course") {
      await prisma.teacherCourse.createMany({ data: entityJson });
    } else if (entityName === "school_teacher") {
      await prisma.schoolTeacher.createMany({ data: entityJson });
    } else if (entityName === "school_course") {
      await prisma.schoolCourse.createMany({ data: entityJson });
    }
  } catch (error) {
    console.log("Error: ", entityName);
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
    const entityName = entity.replace(".json", "");
    const mongoEntityJson = JSON.parse(entityData);
    const entityJson = JSON.parse(entityData).map((entity) => {
      const id = entity._id;
      delete entity._id;
      entity.id = id;
      return entity;
    });
    const res = await Promise.all([
      importData(
        "MongoDB",
        db.collection(entityName).insertMany(mongoEntityJson),
        entityName
      ),
      importData(
        "Prisma",
        importPostgresData(entityName, entityJson),
        entityName
      ),
    ]);
    arr.push(...res);
    console.log("Import " + entityName + " successfully");
  }
  for (let i = 0; i < relations.length; i++) {
    const relation = relations[i];
    const relationData = fs.readFileSync(
      path.join(relationsPath, relation),
      "utf8"
    );
    const relationName = relation.replace(".json", "");
    let mongoRelationJson = JSON.parse(relationData);
    const prismaRelationJson = JSON.parse(relationData);
    if (relationName === "user_course") {
      mongoRelationJson = mongoRelationJson.map((relation) => {
        relation.enroll_time = new Date(relation.enroll_time);
        return relation;
      });
    }
    const res = await Promise.all([
      importData(
        "MongoDB",
        db.collection(relationName).insertMany(mongoRelationJson),
        relationName
      ),
      importData(
        "Prisma",
        importPostgresData(relationName, prismaRelationJson),
        relationName
      ),
    ]);
    arr.push(...res);
    console.log("Import " + relationName + " successfully");
  }
  arr.sort((a, b) => (a.type > b.type ? 1 : -1));
  console.table(arr);
  await prisma.$disconnect();
  await mongo.close();
}

main().catch(console.error);
