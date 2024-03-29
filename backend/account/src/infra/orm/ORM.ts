import { DatabaseConnection } from "../database/DatabaseConnection";

export class ORM {
  constructor(readonly connection: DatabaseConnection) {}

  async save(model: Model) {
    const columns = model.columns.map((column) => column.column).join(",");
    const params = model.columns
      .map((column, index) => `$${index + 1}`)
      .join(",");
    const values = model.columns.map((column: any) => model[column.property]);
    const query = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`;
    await this.connection.query(query, values);
  }

  async get(model: any, field: string, value: string) {
    const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
    const [data] = await this.connection.query(query, [value]);
    const obj = new model();
    for (const column of model.prototype.columns) {
      obj[column.property] = data[column.column];
    }
    return obj;
  }

  async delete(model: Model, field: string, value: string) {
    const query = `delete from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
    await this.connection.query(query, [value]);
  }

  async update(model: Model, id: string) {
    const params = model.columns
      .map((column, index) => `${column.column} = $${index + 2}`)
      .join(",");
    const values = model.columns.map((column: any) => model[column.property]);
    const query = `update ${model.schema}.${model.table} set ${params} where ${
      model.columns.find((column) => column.pk)?.column
    } = $1`;
    await this.connection.query(query, [id, ...values]);
  }
}

export class Model {
  declare schema: string;
  declare table: string;
  declare columns: { property: string; column: string; pk: boolean }[];
  [key: string]: any;
}

export function model(schema: string, table: string) {
  return function (constructor: Function) {
    constructor.prototype.schema = schema;
    constructor.prototype.table = table;
  };
}

export function column(name: string, pk: boolean = false) {
  return function (target: any, propertyKey: string) {
    target.columns = target.columns || [];
    target.columns.push({ property: propertyKey, column: name, pk });
  };
}
