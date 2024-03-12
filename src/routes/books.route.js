import {Router} from "express"

import Book from "../models/book.model.js"

const router = Router()

//Middlewlare

const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json(
                {
                    message: 'El libro no fue encontrado'
                }
            )
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    res.book = book;
    next()
}

// Get All Books
router.get("/",  async (req, res)=>{

    try {
        const books = await Book.find()
        if(books.length == 0){
            return res.status(200).json([])
        }
        return res.json(books)

    } catch (error) {
        return res.status(500).json({message: error.message})
        
    }

})

// Add Book
router.post("/",  async (req, res)=>{

    const {title, author, genre, publication_date} = req.body

    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({message: "Todos los campos son obligatorios"})
    }

    const books = new Book({
        title, author, genre, publication_date
    })

    try {
        const newBook = await books.save()
        return res.status(201).json(newBook)

    } catch (error) {
        return res.status(400).json({message: error.message})
    }

})

// Get book
router.get("/:id", getBook, async(req, res)=>{
    return res.json(res.book)
})

// Updating book
router.put("/:id", getBook, async(req, res)=>{
   try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.title || book.author
    book.genre = req.body.genre || book.genre
    book.publication_date = req.body.publication_date || book.publication_date

    const updateBook = await book.save()

    return res.json(updateBook)
    
   } catch (error) {
    return res.status(404).json({message: error.message})
    
   }
})

// Updating book
router.patch("/:id", getBook, async(req, res)=>{

    if (
      !req.body.title &&
      !req.body.author &&
      !req.body.genre &&
      !req.body.publication_date
    ) {
      return res.json({
        message:
          "Al menos uno de estos campos debes pasar: Title, autor, genre, fecha de publicación",
      });
    }
    try {
     const book = res.book
     book.title = req.body.title || book.title
     book.author = req.body.title || book.author
     book.genre = req.body.genre || book.genre
     book.publication_date = req.body.publication_date || book.publication_date
 
     const updateBook = await book.save()
 
     return res.json(updateBook)
     
    } catch (error) {
     return res.status(404).json({message: error.message})
     
    }
 })

 // Deleting book
router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    if (book) {
      await book.deleteOne({ _id: book._id });
    }

    res
      .status(201)
      .json({ message: `El libro ${book.title} fue eliminado correctamente` });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

 


export default router;