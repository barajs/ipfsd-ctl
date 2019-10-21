import { portion, flow, popEvent } from "@barajs/core";

import IPFSFactory from "ipfsd-ctl";
import { join } from "path";

export interface IPFSNode {
  server: any;
  factory: any;
}

export interface IPFSSpawnOption {
  init?: boolean;
  initOptions?: any;
  start?: boolean;
  repoPath?: string;
  disposable?: boolean;
  defaultAddrs?: boolean;
  args?: string[];
  config?: any;
}

export interface IPFSMold {
  gatewayPort?: number;
  remote?: boolean;
  type?: "js" | "go" | "proc";
  spawn?: IPFSSpawnOption;
}

const BaraIPFS = portion<any, IPFSNode, IPFSMold>({
  name: "bara-ipfs",
  mold: {
    repoPath: join(__dirname, "ipfs-data"),
    port: 9090,
    type: "js"
  },
  init: ({ mold }) => {
    const { port, remote, type } = mold;
    const server = IPFSFactory.createServer(port);
    const factory = IPFSFactory.create({ remote, port, type });
    return { server, factory };
  },
  whenInitialized: flow({
    bootstrap: async ({ context, mold, next }) => {
      const { server, factory } = context;
      const { spawn } = mold;
      await server.start();
      const ipfsd = await factory.spawn(spawn);
      const id = await ipfsd.api.id();
      next({ id });
    }
  })
});

const { whenInitialized: whenDaemonStarted } = popEvent(BaraIPFS);

export { whenDaemonStarted };
export default BaraIPFS;
