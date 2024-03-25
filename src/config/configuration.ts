import * as Joi from 'joi'
import { config } from 'dotenv'

config()

export interface IConfiguration {
    PORT: number
    HOST: string
    POSTGRES_USERNAME: string
    POSTGRES_PASSWORD: string
    POSTGRES_PORT: number
    POSTGRES_HOST: string
    POSTGRES_DATABASE: string
}

export const JWT_SECRET = process.env.JWT_SECRET

export const ConfigurationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default('localhost'),
    POSTGRES_USERNAME: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_HOST: Joi.string().default('localhost'),
    POSTGRES_DATABASE: Joi.string().required(),
})
