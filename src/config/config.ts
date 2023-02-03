import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const schema = {
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development').required(),
    PORT: Joi.number().default(3000).required(),
}

const config: typeof schema = Joi.attempt(process.env, Joi.object(schema).unknown().required());
export default config;