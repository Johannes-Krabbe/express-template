import { User } from '@prisma/client'

export function meTransformer(user: User) {
    return {
        uuid: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
    }
}
