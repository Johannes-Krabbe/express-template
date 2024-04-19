import { Handler } from '@sonic-tech/catena'
import { Router } from 'express'

export const indexController = Router()

indexController.get(
    '/',
    new Handler()
        .resolve((_, res) => {
            res.status(200).send('Hello World')
        })
        .express()
)
