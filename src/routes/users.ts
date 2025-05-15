import { randomUUID } from "crypto"
import { knex } from "../database"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { checkSessionIdExist } from "../middlewares/check-session-id-exist"

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex("users").where("session_id", sessionId).first()

      const meals = await knex("meals")
        .where("session_id", sessionId)
        .select("*")

      const diets = await knex("diets")
        .where("session_id", sessionId)
        .select("*")

      const dietNames = diets.map((diet) => diet.name)

      const mealIncluidInDiet = meals.filter(
        (meal) => !dietNames.includes(meal.name)
      )

      const mealIncluidInDietCount = mealIncluidInDiet.length
      const mealNotIncluidInDietCount = meals.length - mealIncluidInDiet.length

      const statistics = {
        total_meals: meals,
        total_diets: diets,
        total_meals_in_diet: mealIncluidInDietCount,
        total_meals_not_in_diet: mealNotIncluidInDietCount,
        meals_inside_diet: dietNames,
      }

      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" })
      }

      return { user, statistics }
    }
  )

  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (sessionId) {
      return reply.status(403).send({ message: "Usuário com sessão ativa" })
    }

    sessionId = randomUUID()

    reply.cookie("sessionId", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
