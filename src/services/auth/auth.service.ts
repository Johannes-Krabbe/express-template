import { prisma, User } from '../../../prisma/client.prisma'
import { createJwt, JwtType } from '../../helpers/jwt.herper'
import { hashPassword, verifyPassword } from '../../helpers/password.helper'

export async function signup(
    data: ISignupData
): Promise<IAuthenticationResponse> {
    const hashedPassword = await hashPassword({ password: data.password })

    const user = await prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
        },
    })

    const token = createJwt({ user: user, type: JwtType.Auth })

    return {
        user,
        token,
    }
}

export async function emailLogin(
    data: IEmailLoginData
): Promise<IAuthenticationResponse> {
    const user = await prisma.user.findFirst({
        where: {
            email: data.email,
        },
    })

    return await login({ user, password: data.password })
}

export async function usernameLogin(
    data: IUsernameLoginData
): Promise<IAuthenticationResponse> {
    const user = await prisma.user.findFirst({
        where: {
            username: data.username,
        },
    })
    return await login({ user, password: data.password })
}

async function login({
    user,
    password,
}: {
    user: User | null
    password: string
}): Promise<IAuthenticationResponse> {
    if (!user) {
        throw new Error('User not found')
    }

    if (
        (await verifyPassword({
            password,
            hash: user.password,
        })) === false
    ) {
        throw new Error('Invalid password')
    }

    const token = createJwt({ user: user, type: JwtType.Auth })

    return {
        user,
        token,
    }
}

interface ISignupData {
    username: string
    firstName?: string
    lastName?: string
    email: string
    password: string
}

interface IEmailLoginData {
    email: string
    password: string
}

interface IUsernameLoginData {
    username: string
    password: string
}

interface IAuthenticationResponse {
    user: User
    token: string
}
