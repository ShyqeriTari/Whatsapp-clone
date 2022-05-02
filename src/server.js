import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import app from "./app.js"

// Server connection

const port = process.env.PORT

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")

  app.listen(port, () => {
    console.table(listEndpoints(app))
    console.log(`App is running on port ${port} 🟢`)
  })
})