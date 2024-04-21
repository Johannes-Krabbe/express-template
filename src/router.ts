import { Router } from 'express'
import { authController } from './controllers/auth/auth.controller'
import { indexController } from './controllers/index.controller'

export const router = Router()

router.use('/', indexController)
router.use('/auth', authController)
