import fastify from "fastify"
import { env } from "./env"
import { transactionsRoutes } from "./routes/transactions"
import cookie from "@fastify/cookie"
import { usersRoutes } from "./routes/users"
import { mealsRoutes } from "./routes/meal"

const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: "transactions",
})

app.register(usersRoutes, {
  prefix: "users",
})

app.register(mealsRoutes, {
  prefix: "meals",
})

app.listen({ port: env.PORT }).then(() => {
  console.log("Server is running on http://localhost:3333")
})
