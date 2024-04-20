import { Request } from 'express'
import { HTTPError } from '@sonic-tech/catena'
import { User } from '@prisma/client'
import { JwtPayload, verifyJwt } from '../helpers/jwt.herper'
import { prisma } from '../../prisma/client.prisma'

export async function authMiddleware(req: Request) {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        throw new HTTPError(401, 'No token provided')
    }

    let payload: JwtPayload
    try {
        payload = verifyJwt({ token })
    } catch (e) {
        throw new HTTPError(401, 'Invalid token')
    }

    if (payload.type !== 'auth') {
        throw new HTTPError(401, 'Invalid token')
    }

    let user: User | null
    try {
        user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        })
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
