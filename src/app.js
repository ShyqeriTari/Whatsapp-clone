import express from "express"
import cors from "cors"
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import usersRouter from "./services/users/index.js"

const app = express()

app.use(cors())
app.use(express.json())

// Routes

app.use("/user", usersRouter)


// For test purposes

app.get('/test', (req, res) => {
    res.send({ message: 'Hello, World!' })
})

// Error handlers

app.use(badRequestHandler)
app.use(unauthorizedHandler)
app.use(forbiddenHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

export default app
