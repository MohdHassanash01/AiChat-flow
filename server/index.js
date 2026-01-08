import dotenv from 'dotenv'
import express from "express"
import  {ConnectionDB}  from './config.js'
import cors from "cors"
import { promptRouter } from './routes/prompt.js'
import { chatRouter } from './routes/chat.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// middleware
app.use((req,res,next) => {
    console.log("req url : ",req.url);
    console.log("req method : ",req.method);
    next()
})

const PORT = process.env.PORT
const mongoDb_url = process.env.MongoDb_URL

app.use("/api/ask-ai", promptRouter)
app.use("/api/chat",chatRouter)


app.listen(PORT, function(){
    ConnectionDB(mongoDb_url)
     console.log(`server is running on  port ${PORT}`);
     
})