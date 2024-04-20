import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { ENV } from '../env'

export function createJwt({
    type,
    user,
}: {
    type: JwtType
    user: User
}): string {
    const payload: JwtPayload = {
        type,
        id: user.id,
        issuedAt: new Date().toISOString(),
    }
    return jwt.sign(payload, ENV.JWT_SECRET)
}

export function verifyJwt({ token }: { token: string }): JwtPayload {
    const payload = jwt.verify(token, ENV.JWT_SECRET)

    if (typeof payload !== 'object') {
        throw new Error('Invalid token')
    }

    if (
        !('type' in payload) ||
        !('id' in payload) ||
        !('issuedAt' in payload)
    ) {
        throw new Error('Invalid token')
    }

    if (
        typeof payload.type !== 'string' ||
        typeof payload.id !== 'string' ||
        typeof payload.issuedAt !== 'string'
    ) {
        throw new Error('Invalid token')
    }

    if (payload.type !== JwtType.Auth && payload.type !== JwtType.MagicLink) {
        throw new Error('Invalid token')
    }

    return payload as JwtPayload
}

export enum JwtType {
    Auth = 'auth',
    MagicLink = 'magic-link',
}

export type JwtPayload = {
    type: JwtType
    id: string
    issuedAt: string
}
