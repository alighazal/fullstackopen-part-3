require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const Person = require('./models/person')

app.use(cors())
app.use(express.json())


morgan.token('body', (req, res) => {
    if (req.method == 'POST')
        return JSON.stringify( req.body )
    else
        return ""
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook_entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    return res.json(result)
  })
})

app.get('/api/persons/:id', (req, res) => {
    const id = String(req.params.id)

    Person.find({"_id": id}).then(result => {
      return res.json(result)
    })

    // res.status(404).send({ error: 'entry not found' })
})


app.delete('/api/persons/:id', (req, res, next) => {
    const id = String(req.params.id)

    Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
  })

app.get('/info', (req, res) => {

    Person.count({}, function( err, count){
      console.log( "Number of users:", count );
      res.send( `<div>
        <p> Phonebook has info for ${ count } people </p>
        <p> ${Date().toString()}  </p>
      </div>`  )
    })


    
})

app.post('/api/persons/', (req, res)  =>  {
    const body = req.body
  
    if (!body.name || !body.number ) {
      return res.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }
  
    const person = new Person( {
        number: body.number,
        name: body.name,
    })

    person.save().then( savedPerson => {
      res.json(savedPerson)
    } )
    
})

app.put('/api/persons/:id', (req, res, next)  =>  {
  const body = req.body
  const id = String(req.params.id)

  if (!body.name || !body.number ) {
    return res.status(400).json({ 
      error: 'The name or number is missing' 
    })
  }

  const person = {
      number: body.number,
      name: body.name,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
  .catch(error => next(error))
  
})

app.use(express.static('build'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  next(error)
}

app.use(errorHandler)

  
const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})