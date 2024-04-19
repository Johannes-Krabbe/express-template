import { Handler } from '@sonic-tech/catena'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client.prisma'

export const authController = Router()

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
            const user = await prisma.user.create({
                data: {
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                },
            })

            return {
                user,
            }
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
