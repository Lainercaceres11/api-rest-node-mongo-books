import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import router from "./routes/books.route.js"
import connectDB from "./config/db.js"

dotenv.config()

const port = process.env.PORT || 8080

const app = express()

//Middlewlares
app.use(bodyParser.json())

//Routes
app.use("/books", router)


const bootstrap = async () => {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, ()=>{
        console.log(`Corriendo en el puerto ${port}`)
    })
    
};

bootstrap();
