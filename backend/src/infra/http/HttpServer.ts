export type HttpMethod = "get" | "post" | "put" | "delete";

export interface HttpServer {
  register(method: HttpMethod, url: string, callback: Function): void;
  listen(port: number): void;
}
