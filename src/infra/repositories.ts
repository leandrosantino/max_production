import { database } from "./database";
import { Machine, Product, Process, Production } from "./entities";

export const repositories = {
  machine: database.getRepository(Machine),
  product: database.getRepository(Product),
  process: database.getRepository(Process),
  production: database.getRepository(Production)
}
