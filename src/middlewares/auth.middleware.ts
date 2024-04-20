import { Request, Response } from 'express'
import { HTTPError } from '@sonic-tech/catena'
import { User } from '@prisma/client'
import { getUserFromToken } from '../services/auth/auth.service'

export async function authMiddleware(req: Request, res: Response) {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        throw new HTTPError(401, 'No token provided')
    }

    let user: User | null
    try {
        user = await getUserFromToken(token)
    } catch (e) {
        throw new HTTPError(401, 'Invalid token')
    }

    if (!user) {
        throw new HTTPError(401, 'Invalid token')
    }

    return {
        user,
    }
}
