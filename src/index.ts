import express from 'express'
import { ENV } from './env'
import { router } from './router'
const app = express()
const port = 8080

// validate env variables
ENV

app.use(express.json())

app.use(router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
