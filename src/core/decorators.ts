import config from '@src/core/config'
import logger from '@src/core/logging'
import { type Response, type Request } from 'express'
import { type z } from 'zod'

export interface ISchemaValidation {
  body?: z.AnyZodObject
  params?: z.AnyZodObject
  query?: z.AnyZodObject
}

export function ValidateController (schemaValidation: ISchemaValidation) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = function (req: Request, res: Response) {
      const bodyResult = schemaValidation.body?.safeParse(req.body)
      if (bodyResult?.success === false) {
        return res.status(400).json({ message: 'Bad request', error: bodyResult.error.issues })
      }
      const queryResult = schemaValidation.query?.safeParse(req.query)
      if (queryResult?.success === false) {
        return res.status(400).json({ message: 'Bad request', error: queryResult.error.issues })
      }
      const paramsResult = schemaValidation.params?.safeParse(req.params)
      if (paramsResult?.success === false) {
        return res.status(400).json({ message: 'Bad request', error: paramsResult.error.issues })
      }
      // we catch errors in the controller
      originalMethod.apply(this, [req, res]).catch((err: Error & { apiCode?: number }) => {
        logger.error(err.message)
        res.status((err.apiCode != null) ? Number(err.apiCode) : 500).json({
          message: config.NODE_ENV === 'production' ? 'Internal server error' : err.message,
          stack: config.NODE_ENV === 'production' ? undefined : err.stack
        })
      })
    }
    return descriptor
  }
}
