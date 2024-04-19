import express from 'express'
import { ENV } from './env'
const app = express()
const port = 8080

// validate env variables
ENV

app.use(express.json())

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(process.env.TEST)
})
