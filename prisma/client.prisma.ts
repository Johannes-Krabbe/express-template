import { PrismaClient } from '@prisma/client'
import { ENV } from '../src/env'
import { PrismockClient } from 'prismock'

export * from '@prisma/client'

export let prisma: PrismaClient

if (ENV.NODE_ENV === 'test') {
    prisma = new PrismockClient()
} else {
    prisma = new PrismaClient({
        datasourceUrl: ENV.DATABASE_URL,
    })
}

export { prisma as PrismaClient }
