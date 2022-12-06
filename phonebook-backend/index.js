const express = require('express')
const app = express()
app.use(express.json())


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
    res.send(phonebook_entries)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    for (let i = 0; i < phonebook_entries.length; i++ )
    {
        if ( phonebook_entries[i].id == id )
            {
                res.send(phonebook_entries[i])
                return;
        }
    }
    res.status(404).send({ error: 'entry not found' })
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


  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})