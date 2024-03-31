const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");
const url = "mongodb://localhost:27017";
const dbName = "nosql";

const client = new MongoClient(url);

const entityPath = path.join(__dirname, "..", "data", "/entities");
const relationsPath = path.join(__dirname, "..", "data", "/relations");
// Use connect method to connect to the server
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  let db = client.db(dbName);

  const promises = [];

  // Read all files in the entities and relations folder
  // Add to document has name same as file name
  const entities = fs.readdirSync(entityPath);
  const relations = fs.readdirSync(relationsPath);
  await db.dropDatabase();
  db = client.db(dbName);
  console.log("Clear data successfully");
  entities.forEach((entity) => {
    const entityData = fs.readFileSync(path.join(entityPath, entity), "utf8");
    const entityJson = JSON.parse(entityData);
    const entityName = entity.replace(".json", "");
    promises.push(db.collection(entityName).insertMany(entityJson));
  });
  relations.forEach((relation) => {
    const relationData = fs.readFileSync(
      path.join(relationsPath, relation),
      "utf8"
    );
    const relationJson = JSON.parse(relationData);
    const relationName = relation.replace(".json", "");
    promises.push(db.collection(relationName).insertMany(relationJson));
  });
  await Promise.all(promises);
  await client.close();
  console.log("Import data successfully");
}

main().catch(console.error);
