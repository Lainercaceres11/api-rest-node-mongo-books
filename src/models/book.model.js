import mongoose from "mongoose";

//Creamos schema de Books
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    publication_date: String

})

const schemaModel = mongoose.model("Book", bookSchema)

export default schemaModel