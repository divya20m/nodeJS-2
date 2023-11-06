import express from "express"
import { MongoClient } from "mongodb"
import 'dotenv/config'
const app=express()
const port=5000
const mongourl=process.env.mongourl


async function CreateConnection(){
    const client=new MongoClient(mongourl)
    await client.connect()
    console.log("Mongodb is connected")
    return client
}
const client=await CreateConnection()

app.get('/',async (req,res)=>{
    res.send('hello world')
})


//all rooms
app.get('/rooms',async (req,res)=>{
    const rooms=  await client.db("hotels").collection("rooms").find().toArray()
    res.send(rooms)
})


//all bookings
app.get('/customer/bookings',async (req,res)=>{
    const rooms=  await client.db("hotels").collection("bookings").find().toArray()
    res.send(rooms)
})


// by id
app.get('/bookings/customer/:customerId',async (req,res)=>{
    const { customerId } = req.params
    const rooms=  await client.db("hotels").collection("bookings").find({customerId:customerId}).toArray()
    res.send(rooms)
})



//add bookings
app.post('/bookings', express.json(), async (req, res) => {
    const booking = req.body;
    const result =await client.db("hotels").collection("bookings").insertMany(booking);
    res.send(result);
  })


  //deleting bookings
  app.delete('/bookings/:customerId', express.json(), async (req, res) => {
    const booking = req.body
    const result =await client.db("hotels").collection("bookings").deleteOne({ id: id });
    res.send(result)
  })

  //updating bookings
  app.put('/bookings/:customerId', express.json(), async (req, res) => {
    const booking = req.body
    const { customerId } = req.params
    const result =await client.db("hotels").collection("bookings").updateOne({ customerId: customerId }, { $set: booking })
    res.send(result)
  })


//rooms available
  app.get('/rooms/available', async (req, res) => {
    const allRooms = await client.db("hotels").collection("rooms").find().toArray()

    const allBookings = await client.db("hotels").collection("bookings").find().toArray()

    const availableRooms = []

    for (let i = 0; i < allRooms.length; i++) {
        const roomName = allRooms[i].roomName;
        let isAvailable = true;
        for (let j = 0; j < allBookings.length; j++) {
            if (allBookings[j].roomName === roomName) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            availableRooms.push(allRooms[i]);
        }
    }

    res.send(availableRooms);
});

  

app.listen(port,console.log("the port has started on the", port))