import express, { Request, Response, Application } from "express";
import { portion, flow, popEvent, popSeep } from "@barajs/bara";

export interface ExpressMold {
  port?: number;
}

export interface WhenRouteGet {
  request: Request;
  response: Response;
}

const ExpressServer = portion<Request, Application, ExpressMold>({
  name: "bara-express",
  mold: { port: +process.env.PORT! || 3456 },
  init: () => {
    const expressApp: Application = express();
    return expressApp;
  },
  whenInitialized: flow({
    bootstrap: ({ context: expressApp, next, mold }: any) => {
      const { port } = mold;
      expressApp.listen(port, function() {
        console.log(`Express server is listening on port ${port}`);
        next();
      });
    }
  }),
  whenRouteGet: flow<WhenRouteGet, Application, ExpressMold>({
    bootstrap: ({ context: expressApp, next }) => {
      expressApp.get("*", (request: Request, response: Response) => {
        next({ request, response });
      });
    },
    seep: {
      hasQuery: (query?: string) => ({ request }: WhenRouteGet) => {
        return !!request.query && query && query in request.query;
      },
      hasRoute: (route?: string) => ({ request }: WhenRouteGet) => {
        return request.route === route;
      }
    }
  })
});

const { whenInitialized: whenExpressInitialized, whenRouteGet } = popEvent(
  ExpressServer
);
const { hasQuery } = popSeep(whenRouteGet);

export { whenExpressInitialized, whenRouteGet, hasQuery };

export default ExpressServer;
