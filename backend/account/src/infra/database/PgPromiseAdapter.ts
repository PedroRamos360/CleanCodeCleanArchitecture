import pg from "pg-promise/typescript/pg-subset";
import { DatabaseConnection } from "./DatabaseConnection";
import pgp from "pg-promise";

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<{}, pg.IClient>;

  constructor() {
    this.connection = pgp()("postgres://postgres:mypgdbpass@localhost:5432");
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
