import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import adminRouter from '../src/routes/admin.routes.js'
import voterRouter from '../src/routes/voter.routes.js'

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>')
})

app.use("/admin", adminRouter)
app.use("/vote", voterRouter)

export { app }
