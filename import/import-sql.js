const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient({});
const entityPath = path.join(__dirname, "..", "data", "/entities");
const relationsPath = path.join(__dirname, "..", "data", "/relations");
async function clearData() {
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
  console.log("Clear data successfully");
}
async function main() {
  await prisma.$connect();
  console.log("Connected successfully to server");
  const promises = [];
  await clearData();
  const entities = fs.readdirSync(entityPath);
  const relations = fs.readdirSync(relationsPath);
  entities.forEach((entity) => {
    const entityData = fs.readFileSync(path.join(entityPath, entity), "utf8");
    const entityJson = JSON.parse(entityData).map((entity) => {
      const id = entity._id;
      delete entity._id;
      entity.id = id;
      return entity;
    });
    const entityName = entity.replace(".json", "");
    if (entityName === "users") {
      promises.push(prisma.user.createMany({ data: entityJson }));
    } else if (entityName === "courses") {
      promises.push(prisma.course.createMany({ data: entityJson }));
    } else if (entityName === "teachers") {
      promises.push(prisma.teacher.createMany({ data: entityJson }));
    } else if (entityName === "schools") {
      promises.push(prisma.school.createMany({ data: entityJson }));
    }
  });
  await Promise.all(promises);
  console.log("Import entities successfully");
  promises.length = 0;
  relations.forEach((relation) => {
    const relationData = fs.readFileSync(
      path.join(relationsPath, relation),
      "utf8"
    );
    const relationJson = JSON.parse(relationData);
    const relationName = relation.replace(".json", "");
    switch (relationName) {
      case "school-course":
        promises.push(prisma.schoolCourse.createMany({ data: relationJson }));

        break;
      case "school-teacher":
        promises.push(prisma.schoolTeacher.createMany({ data: relationJson }));
        break;
      case "teacher-course":
        promises.push(prisma.teacherCourse.createMany({ data: relationJson }));
        break;
      case "user-course":
        promises.push(prisma.userCourse.createMany({ data: relationJson }));
        break;
    }
  });
  await Promise.all(promises);
  prisma.$disconnect();
  console.log("Import relations successfully");
  console.log("Finish");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
