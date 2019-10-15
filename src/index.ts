import { portion, flow, popEvent, popSeep } from '@barajs/bara'
import express, { Request, Response, Application } from 'express'

import { WhenRequest } from './types'
import { hasQuery, hasPath } from './seep'

export interface ExpressMold {
  port?: number
  middlewares?: any[]
}

const ExpressServer = portion<Request, Application, ExpressMold>({
  name: 'bara-express',
  mold: { port: +process.env.PORT! || 3456 },
  init: () => {
    const expressApp: Application = express()
    return expressApp
  },
  whenInitialized: flow({
    bootstrap: ({ context: expressApp, next, mold }: any) => {
      const { port, middlewares } = mold
      if (middlewares && middlewares.length > 0) {
        for (const mw of middlewares) expressApp.use(mw)
      }
      expressApp.listen(port, function() {
        next({ port })
      })
    },
  }),
  whenAnyGet: flow<WhenRequest, Application, ExpressMold>({
    bootstrap: ({ context: expressApp, next }) => {
      expressApp.get('*', (request: Request, response: Response) => {
        next({ request, response })
      })
    },
    seep: { hasGetQuery: hasQuery, hasGetPath: hasPath },
  }),
  whenAnyPost: flow<WhenRequest, Application, ExpressMold>({
    bootstrap: ({ context: expressApp, next }) => {
      expressApp.post('*', (request: Request, response: Response) => {
        next({ request, response })
      })
    },
    seep: { hasPostQuery: hasQuery, hasPostPath: hasPath },
  }),
})

const {
  whenInitialized: whenExpressInitialized,
  whenAnyGet,
  whenAnyPost,
} = popEvent(ExpressServer)

const { hasGetQuery, hasGetPath } = popSeep(whenAnyGet)
const { hasPostQuery, hasPostPath } = popSeep(whenAnyPost)

export {
  whenExpressInitialized,
  whenAnyGet,
  whenAnyPost,
  hasGetQuery,
  hasGetPath,
  hasPostQuery,
  hasPostPath,
}

export * from './types'
export default ExpressServer
