const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const json = require("big-json");
// Database Name
const dbName = "nosql";

const client = new MongoClient(url);


async function main() {
    await client.connect();
  
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    // Sử dụng aggregate framework để group và count số lượt xem của mỗi video
    const start = new Date();
    const viewsByVideo = await db.collection("user_video").aggregate([
      { $group: { _id: "$video_id", views: { $sum: 1 } } }
    ]).toArray();
    const end = new Date();
  
    console.log("Time to run aggregation: ", end - start, "ms");
    await client.close();
  }

  main().catch(console.error);
  