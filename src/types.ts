import { Request, Response } from 'express'

export interface WhenRequest {
  request: Request
  response: Response
}

export interface ExpressMold {
  port?: number
  middlewares?: any[]
}
