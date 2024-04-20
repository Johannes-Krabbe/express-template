import { Handler } from '@sonic-tech/catena'
import { Router } from 'express'
import { z } from 'zod'
import { signup } from '../../services/auth/auth.service'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { meTransformer } from '../../transformers/auth.transformer'

export const authController = Router()

authController.get(
    '/me',
    new Handler()
        .middleware(authMiddleware)
        .resolve(async (_req, _res, context) => {
            const { user } = context

            return {
                user,
            }
        })
        .transform((data) => {
            return {
                user: meTransformer(data.user),
            }
        })
        .express()
)

authController.post(
    '/signup',
    new Handler()
        .validate('body', {
            username: z.string().min(3),
            firstName: z.string().min(3),
            lastName: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8),
        })
        .resolve(async (req) => {
            const { username, firstName, lastName, email, password } = req.body

            const signupResponse = await signup({
                username,
                firstName,
                lastName,
                email,
                password,
            })

            return signupResponse
        })
        .transform((data) => {
            return {
                data: {
                    uuid: data.user.id,
                    email: data.user.email,
                },
            }
        })
        .express()
)
