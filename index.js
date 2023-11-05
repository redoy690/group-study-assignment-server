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
        



        // product db collection

        // send data to the db
        app.post('/assignment', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await assignmentCollection.insertOne(newProduct)
            res.send(result)
        })


        //  get all assignment
        app.get('/assignment', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //  get one assignment
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query);
            res.send(result)
        })

        // // delete data from ui
        // app.put('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedCoffee = req.body
        //     const coffee = {
        //         $set: {
        //             name: updatedCoffee.name,
        //             brand: updatedCoffee.brand,
        //             type: updatedCoffee.type,
        //             price: updatedCoffee.price,
        //             Rating: updatedCoffee.Rating,
        //             details: updatedCoffee.details,
        //             photo: updatedCoffee.photo,
        //         }
        //     }
        //     const result = await productCollection.updateOne(filter, coffee, options)
        //     res.send(result);
        // })




        // add to card db collection
        // app.post('/addtocart', async (req, res) => {
        //     const newProduct = req.body;
        //     console.log(newProduct)
        //     const result = await cartcollection.insertOne(newProduct)
        //     res.send(result)
        // })


         
        // app.get('/addtocart', async (req, res) => {
        //     const cursor = cartcollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })


        // app.get('/addtocart/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await cartcollection.findOne(query);
        //     res.send(result)
        // })

       

        // app.delete('/addtocart/:id', async(req,res)=>{
        //     const id = req.params.id
        //     const query = {_id: new ObjectId(id)}
        //     const result = await cartcollection.deleteOne(query)
        //     res.send(result)
        // })





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


