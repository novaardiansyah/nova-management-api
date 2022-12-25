import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import usersRoutes from './routes/users.js'
import menuRoutes from './routes/menu.js'
import submenuRoutes from './routes/submenu.js'
import rolesRoutes from './routes/roles.js'
import roleAccessRoutes from './routes/roleAccess.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())

app.use('/users', usersRoutes)
app.use('/menu', menuRoutes)
app.use('/submenu', submenuRoutes)
app.use('/roles', rolesRoutes)
app.use('/roleAccess', roleAccessRoutes)
app.use('/auth', authRoutes)

app.use((req, res, next) => {
  res.status(404).json({ status: false, message: 'Your Request Was Not found.', data: {} })
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