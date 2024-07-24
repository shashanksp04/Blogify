// to run backend run "npm run dev"

import express from 'express';
import fs from 'fs';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import path from 'path';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});
// dotenv.config();
// const uri = process.env.MONGO_CONNECTION_STRING;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, 'src/credentials/.env') });
import { MongoClient, ServerApiVersion } from 'mongodb';


const databaseAndCollection = {db: `${process.env.MONGO_DB_NAME}`, collection:`${process.env.MONGO_COLLECTION}`};
const uri = `${process.env.MONGO_CONNECTION_STRING}`;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

const app = express();
app.use(express.json()); // tells the server that the POST request will have the payload inform of a JSON in the body

app.use(express.static(path.join(__dirname,'../build')));

app.get(/^(?!\/api).+/,(req,res) => {
    res.sendFile(path.join(__dirname,'../build/index.html'));
});
// to use nodemon - npx nodemon src/server.js or go to pacakge.json and add this as a script and then you can do "npm run dev"

app.use(async (req, res, next) => {
    const { authToken } = req.headers;
    
    try{
        if(authToken){
            req.user = await admin.auth().verifyIdToken(authToken);
        }
    } catch(error){
        return res.sendStatus(400);
    }

    req.user = req.user || {};
    
    next();
});
// Function to reset the mongoDB database
// async function updateDataType() {

//     try {
//         await client.connect();

//         const database = client.db(databaseAndCollection.db);
//         const collection = database.collection(databaseAndCollection.collection);

//         const updateResult = await collection.updateMany(
//             { upvotes: { $exists: true } }, // Filter documents with the field 'upvotes' | for comments replace "upvotes" with comments
//             [
//              { $set: { upvotes: 0 } } // Convert 'upvotes' to integer | for comments replace "upvotes: 0" with "comment : []"
//             ]
//         );

//         console.log(`${updateResult.modifiedCount} documents updated.`);
//     } finally {
//         await client.close();
//     }
// }

// updateDataType();

async function findValue(value){
    await client.connect();
    let filter = {name: value};
    const result = await client.db(databaseAndCollection.db)
                            .collection(databaseAndCollection.collection)
                            .findOne(filter);
    return result;
}

async function updateValue(name,value,flag,UID){ // flag is true means we're updating upvotes, false means updating comments
        await client.connect();
        let filter = {name: name};
        let result = null;
        if(flag){
            const updateDocument = {
                $inc: {upvotes: 1},
                $push: {upvotesIds: UID}
            }
            result = await client.db(databaseAndCollection.db)
                                .collection(databaseAndCollection.collection)
                                .updateOne(filter, updateDocument);
        }else{
            const updateComment = {
                $push: {comment: value}
            }
            result = await client.db(databaseAndCollection.db)
                                .collection(databaseAndCollection.collection)
                                .updateOne(filter,updateComment);
        }
        return result;
}

app.get('/api/articles/:name',async(req,res)=>{
    const {name} = req.params;
    const {uid} = req.user;
    const result = await findValue(name);
    if(result){
        const upvoteIds = result.upvoteIds || [];
        result.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(result);
    } else{
        res.sendStatus(404).send("Article not found");
    }
});


app.use((req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
});

app.put('/api/articles/:name/upvote', async(req,res)=>{
    const {name} = req.params;
    const present = await findValue(name);
    const {uid} = req.user;

    if(present){
        const upvoteIds = present.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if(canUpvote){
            const result = await updateValue(name,0,true);
            const newResult = await findValue(name);
            res.json(newResult);
        }
    }else{
        res.sendStatus(404).send("Article not found");
    }
});

app.post('/api/articles/:name/comments', async (req,res)=>{
    const { text } = req.body;
    const { email } = req.user;
    // // res.send(`This is the posted value ${req.body.posted}`)
    const {name} = req.params;
    const result = await updateValue(name,{ [email] : text},false);
    const newResult = await findValue(name);
    if(result){
        // res.send(`The ${newResult.name} article has had an update in the comment`);
        res.json(newResult);
    }else{
        res.sendStatus(404).send("Article not found");
    }
});

const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`Server is listening on port http://localhost:${PORT}`);
});


// below is the code which was used for learning purpose 

// app.get('/articles/:name',async(req,res) => {
//     const {nameParam} = req.params;
//     res.send('Received!');
// })

// app.post('/articles/:name', async(req,res) => {
//     const {name} = req.body;
//     console.log(name)
//     res.send(`Received ${name}`);
// })

// let articleInfo = [{
//     name : 'learn-react',
//     upvotes: 0,
//     comments: [],
// }, {
//     name : 'learn-node',
//     upvotes: 0,
//     comments: [],
// }, {
//     name : 'mongodb',
//     upvotes: 0,
//     comments: [],
// }
// ]
