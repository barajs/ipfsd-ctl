import { WhenRequest } from '../types'

export const hasQuery = (query?: string) => ({ request }: WhenRequest) => {
  return !!request.query && query && query in request.query
}

export const hasPath = (path?: string) => ({ request }: WhenRequest) => {
  return request.originalUrl === path
}
