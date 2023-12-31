const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


// middelware

app.use(cors());
app.use(express.json());




// groups
// imQq6vaJycmD6kMQ

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfjtqgg.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        const assignmentCollection = client.db('assignmentdb').collection('allassignment')
        const submitResultCollection = client.db('assignmentdb').collection('submitresult')
        const marksCollection = client.db('assignmentdb').collection('markscomplete')
       




       






        // ----------------assignment collection part (1) ------------

        // send data to the db
        app.post('/assignment', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await assignmentCollection.insertOne(newProduct)
            res.send(result)
        })


        //  get all assignment db to ui
        app.get('/assignment', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //  get one assignment
        app.get('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query);
            res.send(result)
        })


        // update
        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateassignment = req.body
            const assignment = {
                $set: {
                    title: updateassignment.title,
                    level: updateassignment.level,
                    totalMarks: updateassignment.totalMarks,
                    date: updateassignment.date,
                    questiondetails: updateassignment.questiondetails,
                    photo: updateassignment.photo,


                }
            }
            const result = await assignmentCollection.updateOne(filter, assignment, options)
            res.send(result);
        })

        // delete running assignment
        app.delete('/assignment/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query)
            res.send(result)
        })




        // find one data for my running assignment(find with mail)
        app.get('/assignments', async (req, res) => {
            console.log(req.query.questionEmail)
            let query = {};
            if (req.query?.questionEmail) {
                query = { questionEmail: req.query.questionEmail }
            }
            const result = await assignmentCollection.find(query).toArray()
            res.send(result)
        })





        //  -----------------db submit collection part(2) ---------------------






        //    detelete data from submit collection
        app.delete('/answers/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await submitResultCollection.deleteOne(query)
            res.send(result)
        })



        // result submit db collection
        // rcv data from ui
        app.post('/answer', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await submitResultCollection.insertOne(newProduct)
            res.send(result)
        })





        // view one submit result
        app.get('/answer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await submitResultCollection.findOne(query);
            res.send(result)
        })

        // update marks
        app.put('/answer/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatemarks = req.body
            const marks = {
                $set: {
                    status: updatemarks.status,
                    givenmarks: updatemarks.givenmarks,
                    marksfeedback: updatemarks.marksfeedback,
                    givermarksDisplayName: updatemarks.givermarksDisplayName,
                    givenmarksEmail: updatemarks.givenmarksEmail,

                }
            }
            const result = await submitResultCollection.updateOne(filter, marks, options)
            res.send(result);
        })


        // find one data for my pending  assignment(find with mail)
        app.get('/answers', async (req, res) => {
            console.log(req.query.questionEmail)
            let query = {};
            if (req.query?.questionEmail) {
                query = { questionEmail: req.query.questionEmail }
            }
            const result = await submitResultCollection.find(query).toArray()
            res.send(result)
        })




        // ------------------- db marks collection part (3) ---------------
        //marks data collect


        app.post('/marks', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await marksCollection.insertOne(newProduct)
            res.send(result)
        })


        //  see complete data from marks collection
        app.get('/marks', async (req, res) => {
            const cursor = marksCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //  see complete data from marks collection
        app.get('/marks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await marksCollection.findOne(query);
            res.send(result)
        })

        // find one data for complete assignment(find with mail)
        app.get('/gmarks', async (req, res) => {
            console.log(req.query.questionEmail)
            let query = {};
            if (req.query?.questionEmail) {
                query = { questionEmail: req.query.questionEmail }
            }
            const result = await marksCollection.find(query).toArray()
            res.send(result)
        })




        // pagination part
        // -----------------------------------------------------------

        //  pagination for pending submitted page (pagination part 1)
        app.get('/assignmentCount', async (req, res) => {
            const count = await submitResultCollection.estimatedDocumentCount();
            res.send({ count })
        })

        // send ta from db(pagination part 2)
        app.get('/answer', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)

            const result = await submitResultCollection.find()
                .skip(page * size)
                .limit(size)
                .toArray();

            res.send(result)
        })


        //------------------------------------------
        //   pagination for complete submited page(pagination part 1)
        app.get('/resultCount', async (req, res) => {
            const count = await marksCollection.estimatedDocumentCount();
            res.send({ count })
        })

        // send ta from db(pagination part 2)
        app.get('/result', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)

            const result = await marksCollection.find()
                .skip(page * size)
                .limit(size)
                .toArray();

            res.send(result)
        })

        //--------------------------------------------







        // Send a ping to confirm a successful connection

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('group study server is running')
})

app.listen(port, () => {
    console.log(`cgroup study server is running on port :${port}`)
})


