import { DataSource } from "typeorm"
import { Machine, Product, Process, Production } from "./entities"
import { configRepository } from "@/repositories/configRepository"

const config = configRepository.getConfig()

export const database = new DataSource({
  type: "sqlite",
  database: config.databaseUrl,
  synchronize: true,
  logging: config.log,
  entities: [Machine, Product, Process, Production],
  migrations: [],
  subscribers: [],
})
