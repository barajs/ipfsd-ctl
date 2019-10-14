import { run, app, act, cond } from "@barajs/core";
import ExpressServer, {
  whenExpressInitialized,
  whenRouteGet,
  hasQuery,
  WhenRouteGet
} from "./src";

run(
  app({
    portion: [ExpressServer({ port: 3200 })],
    trigger: [
      whenExpressInitialized(
        // An `act` will also be created new stream when subscribe to a flow.
        act(() => console.log("Hello from Bara trigger")),
        act(() => console.log("Bara has initialized this trigger!"))
      ),
      whenRouteGet(
        // Each `cond` will create to new sub stream with its own conditional checker.
        cond(
          hasQuery("first"),
          act(({ request, response }: WhenRouteGet) => {
            const { query } = request;
            response.send({ success: "Congrats!", query });
          })
        )
      )
    ]
  })
);
