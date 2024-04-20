import { Handler } from '@sonic-tech/catena'
import { Router } from 'express'
import { z } from 'zod'
import {
    emailLogin,
    signup,
    usernameLogin,
} from '../../services/auth/auth.service'
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
                me: meTransformer(data.user),
            }
        })
        .express()
)

authController.post(
    '/signup',
    new Handler()
        .validate('body', {
            username: z
                .string()
                .min(3)
                .max(64)
                .regex(/^[a-zA-Z0-9_-]+$/),
            firstName: z.string().min(3).max(64).optional(),
            lastName: z.string().min(3).max(64).optional(),
            email: z.string().email(),
            password: z.string().min(8).max(128),
        })
        .resolve(async (req) => {
            const { username, firstName, lastName, email, password } = req.body

            const signupResponse = await signup({
                username: username.toLowerCase(),
                firstName,
                lastName,
                email: email.toLowerCase(),
                password,
            })

            return signupResponse
        })
        .transform((data) => {
            return {
                me: meTransformer(data.user),
                token: data.token,
            }
        })
        .express()
)

authController.post(
    '/login/email',
    new Handler()
        .validate('body', {
            email: z.string().email(),
            password: z.string().min(8),
        })
        .resolve(async (req) => {
            const { email, password } = req.body

            const loginResponse = await emailLogin({
                email,
                password,
            })

            return loginResponse
        })
        .transform((data) => {
            return {
                data: {
                    me: meTransformer(data.user),
                    token: data.token,
                },
            }
        })
        .express()
)

authController.post(
    '/login/username',
    new Handler()
        .validate('body', {
            username: z
                .string()
                .min(3)
                .max(64)
                .regex(/^[a-zA-Z0-9_-]+$/),

            password: z.string().min(8),
        })
        .resolve(async (req) => {
            const { username, password } = req.body

            const loginResponse = await usernameLogin({
                username,
                password,
            })

            return loginResponse
        })
        .transform((data) => {
            return {
                data: {
                    me: meTransformer(data.user),
                    token: data.token,
                },
            }
        })
        .express()
)
