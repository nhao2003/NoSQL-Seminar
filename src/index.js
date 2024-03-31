const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "nosql";

const client = new MongoClient(url);


async function main() {
    await client.connect();
  
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    const start = new Date();
    const courseEnrolls = await db.collection("user-course").aggregate([
      { $group: { _id: "$course_id", views: { $sum: 1 } } }
    ]).toArray();
    const end = new Date();
    console.log(courseEnrolls);
    console.log("Time to run aggregation: ", end - start, "ms");
    await client.close();
  }

  main().catch(console.error);
  