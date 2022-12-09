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


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phonebook_entries = phonebook_entries.filter(phonebook_entry => phonebook_entry.id !== id)
    res.status(204).end()
  })

app.get('/info', (req, res) => {
    res.send( `<div>
        <p> Phonebook has info for ${ phonebook_entries.length } people </p>
        <p> ${Date().toString()}  </p>
    </div>`  )
})

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body.name || !body.number ) {
      return res.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }

    // const repeatedEntry = phonebook_entries.find( entry => entry.name == body.name  )
    // if ( repeatedEntry !== undefined )
    //     return res.status(400).json({ 
    //     error: 'name must be unique' 
    //   })

  
    const person = new Person( {
        number: body.number,
        name: body.name,
    })
  
    res.json(person.save())
})

app.use(express.static('build'))

  
const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})