import fastify from "fastify"
import { env } from "./env"
import cookie from "@fastify/cookie"
import { usersRoutes } from "./routes/users"
import { mealsRoutes } from "./routes/meal"
import { dietsRoutes } from "./routes/diet"

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: "users",
})

app.register(mealsRoutes, {
  prefix: "meals",
})

app.register(dietsRoutes, {
  prefix: "diets",
})


app.listen({ port: env.PORT }).then(() => {
  console.log("Server is running on http://localhost:3333")
})
