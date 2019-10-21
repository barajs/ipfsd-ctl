declare module 'ipfsd-ctl' {
  class IPFSFactory {
    static create(options?: any): any
    static createServer(port?: number): any
  }
  export default IPFSFactory
}
