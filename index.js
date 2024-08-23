const express=require('express');
require('dotenv').config()
const cors=require('cors')
const app=express();

const port=process.env.PORT||3000;

app.use(cors())
app.use(express.json())






// ----------------------------//

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vmhty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     
    const productCollection=client.db("colletedProducts").collection("products")
     
   
    app.get('/',(req,res)=>{
        res.send("THIS IS SERVER SITE AND SERVER LOAD IN SITE")
    })
    
    app.get('/products',async(req,res)=>{
        const cursor=productCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
    
    app.post('/products',async(req,res)=>{
        const product=req.body;
        console.log(product);
        const result=await productCollection.insertOne(product);
        res.send(result)
       
    })
  
    // --------------------------
    app.get('/updates/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await productCollection.findOne(query);
        res.send(result)
    })

    app.put('/updates/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const options={upsert:true};
        const updateProducts=req.body;
        const updates={
            $set:{
                   name:updateProducts.name,
                   model:updateProducts.model,
                   price:updateProducts.price,
                   description:updateProducts.description,
            }
        }
        
        const result = await productCollection.updateOne(filter, updates, options);

        res.send(result)

       
    })
    // ------------------------------


    app.delete('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await productCollection.deleteOne(query);
        res.send(result);

    })
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// ---------------------------------///
app.listen(port,()=>{
    console.log(` THE SERVER IS RUNNING IN PORT :${port}` )
})