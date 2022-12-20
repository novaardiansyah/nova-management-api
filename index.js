import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import usersRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())

app.use('/users', usersRoutes)
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World')
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const db = mongoose.connection

db.on('error', (error) => console.error(error))

db.once('open', () => {
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    if (err) return console.log(err);

    names.forEach(function (e) {
      mongoose.connection.db.collection(e.name).createIndex({ "$**": "text" })
    });

    console.log('ReIndexing all collections')
  });

  app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))
})