import express from 'express'
import {
  type Application,
  type Request,
  type Response,
  type NextFunction,
  type Router
} from 'express'
import helmet from 'helmet'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import bodyParser from 'body-parser'
import expressJSDocSwagger from 'express-jsdoc-swagger'
import morgan from 'morgan'
import logger from '@core/logging'

export default class App {
  public app: Application

  constructor (routers: Router[]) {
    this.app = express()
    this.config()
    this.mountRoutes(routers)
  }

  private getRateLimits (): (req: Request, res: Response, next: NextFunction) => void {
    const rateLimiter = new RateLimiterMemory({
      keyPrefix: 'middleware',
      points: 10, // 10 requests
      duration: 1 // per 1 second by IP
    })
    const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
      rateLimiter
        .consume(req.ip)
        .then(() => {
          next()
        })
        .catch(() => {
          res.status(429).send('Too Many Requests')
        })
    }
    return rateLimiterMiddleware
  }

  private mountRoutes (routers: Router[]): void {
    routers.forEach((router) => {
      this.app.use('/api/v1', router)
    })
  }

  public setupSwagger (config: {
    version: string
    title: string
    license: {
      name: string
    }
    security: {
      BasicAuth: {
        type: string
        scheme: string
      }
    }
    filesPattern: string[]
    swaggerUIPath: string
    exposeSwaggerUI: boolean
    exposeApiDocs: boolean
    apiDocsPath: string
  }): void {
    const options = {
      info: {
        version: '1.0.0',
        title: 'Market Depth API',
        license: {
          name: 'MIT'
        }
      },
      security: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      },
      // Base directory which we use to locate your JSDOC files
      baseDir: __dirname,
      // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
      filesPattern: ['./api/**/*.router.ts', './services/*.service.ts'],
      // URL where SwaggerUI will be rendered
      swaggerUIPath: '/api-docs',
      // Expose OpenAPI UI
      exposeSwaggerUI: true,
      // Expose Open API JSON Docs documentation in `apiDocsPath` path.
      exposeApiDocs: false,
      // Open API JSON Docs endpoint.
      apiDocsPath: '/v3/api-docs',
      // Set non-required fields as nullable by default
      notRequiredAsNullable: false,
      // You can customize your UI options.
      // you can extend swagger-ui-express config. You can checkout an example of this
      // in the `example/configuration/swaggerOptions.js`
      swaggerUiOptions: {},
      // multiple option in case you want more that one instance
      multiple: true
    }
    expressJSDocSwagger(this.app)(Object.assign(config, options))
  }

  private config (): void {
    this.app.use(helmet())
    this.app.disable('x-powered-by')
    this.app.use(this.getRateLimits())
    this.app.use(bodyParser.json({ limit: '1mb' }))
    const logger = morgan(':method :url :status :res[content-length] - :response-time ms')
    this.app.use(logger)
  }

  public listen (port: number): App {
    this.app.listen(port, () => {
      logger.info(`Server is listening on port ${port}!`)
    })
    return this
  }
}
