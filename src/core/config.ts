import * as dotenv from 'dotenv'
import { z } from 'zod'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

enum NODE_ENV {
  development = 'development',
  production = 'production',
  test = 'test'
}
const schema = z.object({
  NODE_ENV: z.nativeEnum(NODE_ENV),
  PORT: z.string().default('3000'),
  BITFINEX_API_KEY: z.string().min(43),
  BITFINEX_SECRET_KEY: z.string().min(43)
})

type configType = z.infer<typeof schema>
const config: configType = schema.parse(process.env)

export default config
