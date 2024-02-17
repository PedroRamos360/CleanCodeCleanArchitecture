import express, { Request, Response, Express } from "express";
import { HttpMethod, HttpServer } from "./HttpServer";

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: HttpMethod, url: string, callback: Function): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        res.status(422).json({ error: error.message });
      }
    });
  }

  listen(port: number) {
    this.app.listen(port);
    console.log(`Server is running at localhost:${port}`);
  }
}
