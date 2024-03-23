import * as Joi from 'joi'

export interface IConfiguration {
    PORT: number
    HOST: string
}

export const ConfigurationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default('localhost'),
})
