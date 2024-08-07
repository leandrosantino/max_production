import { DataSource } from "typeorm"
import { Machine, Product, Process, Production } from "./entities"
import { configRepository } from "@/repositories/configRepository"

export const database = new DataSource({
  type: "sqlite",
  database: "database/database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Machine, Product, Process, Production],
  migrations: [],
  subscribers: [],
})
