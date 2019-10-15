import { flow } from '@barajs/core'
import { Application, Request, Response } from 'express'

import { WhenRequest, ExpressMold } from '../types'
import { hasQuery, hasPath } from '../seep'

export const whenAnyGet = flow<WhenRequest, Application, ExpressMold>({
  bootstrap: ({ context: expressApp, next }) => {
    expressApp.get('*', (request: Request, response: Response) => {
      next({ request, response })
    })
  },
  seep: { hasGetQuery: hasQuery, hasGetPath: hasPath },
})
