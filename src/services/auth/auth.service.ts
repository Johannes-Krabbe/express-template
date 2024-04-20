import { prisma } from '../../../prisma/client.prisma'

export async function signup(data: SignupData) {
    const user = await prisma.user.create({
        data,
    })

    return {
        user,
    }
}

export async function getUserFromToken(token: string) {
    const user = await prisma.user.findFirst()

    if (!user) {
        throw new Error('Invalid token')
    }

    return user
}

interface SignupData {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}
