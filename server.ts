import { run, app, act, cond } from '@barajs/core'

import Express, {
  whenExpressInitialized,
  whenAnyGet,
  whenAnyPost,
  hasGetQuery,
  WhenRequest,
  hasPostPath,
} from './src'

run(
  app({
    portion: [Express({ port: 3200 })],
    trigger: [
      whenExpressInitialized(
        act(({ port }: any) =>
          console.log(`Express server started on http://localhost:${port}`),
        ),
        act(() => console.log('Hello from Bara trigger')),
      ),
      whenAnyGet(
        cond(
          hasGetQuery('first'),
          act(({ request, response }: WhenRequest) => {
            const { query } = request
            response.send({ success: true, query })
          }),
        ),
      ),
      whenAnyPost(
        cond(
          hasPostPath('/webhook'),
          act(({ request, response }: WhenRequest) => {
            const { query, route } = request
            response.send({ success: true, query, route })
          }),
        ),
      ),
    ],
  }),
)
