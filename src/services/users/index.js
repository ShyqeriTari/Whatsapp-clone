import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"
import { generateAccessToken } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import q2m from "query-to-mongo"

const usersRouter = express.Router()

usersRouter.post("/account", async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body)
      const { _id, name } = await newUser.save()
      const accessToken = await generateAccessToken({ _id: _id, name: name })
      res.status(201).send({ _id, accessToken })
    } catch (error) {
      next(error)
    }
  })

usersRouter.post("/session", async (req, res, next) => {
    try {
      const { email, password} = req.body
  
      const user = await UsersModel.checkCredentials(email, (password))
  
      if (user) {
  
        const accessToken = await generateAccessToken({ _id: user._id, name: user.name })
  
        res.send({ accessToken })
      } else {
        next(createError(401, `Credentials are not ok!`))
      }
    } catch (error) {
      next(error)
    }
  })

  usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const mongoQuery = q2m(req.query)
      const user = await UsersModel.find({username: {$regex : mongoQuery.criteria.q, $options : "i"}})
      if (user) {
        res.send(user)
      } else {
        next(404, `User with id ${req.user._id} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })

  usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.user._id)
      if (user) {
        res.send(user)
      } else {
        next(404, `User with id ${req.user._id} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })

  usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.params.id)
      if (user) {
        res.send(user)
      } else {
        next(404, `User with id ${req.params.id} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })


export default usersRouter