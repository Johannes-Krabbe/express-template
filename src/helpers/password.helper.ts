// documentation: https://github.com/ranisalt/node-argon2/wiki/Options
import { hash, verify, argon2id } from 'argon2'

export async function hashPassword({
    password,
}: {
    password: string
}): Promise<string> {
    const argonHash = await hash(password, {
        // Default values
        type: argon2id,
        timeCost: 3,
        parallelism: 4,
        memoryCost: 2 ** 16,
    })

    return argonHash
}

export async function verifyPassword({
    password,
    hash,
}: {
    password: string
    hash: string
}): Promise<boolean> {
    try {
        return await verify(hash, password)
    } catch (e) {
        return false
    }
}
