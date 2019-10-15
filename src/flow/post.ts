import { flow } from '@barajs/core'
import { Application, Request, Response } from 'express'

import { WhenRequest, ExpressMold } from '../types'
import { hasQuery, hasPath } from '../seep'

export const whenAnyPost = flow<WhenRequest, Application, ExpressMold>({
  bootstrap: ({ context: expressApp, next }) => {
    expressApp.post('*', (request: Request, response: Response) => {
      next({ request, response })
    })
  },
  seep: { hasPostQuery: hasQuery, hasPostPath: hasPath },
})
