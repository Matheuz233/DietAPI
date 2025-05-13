import { randomUUID } from "crypto"
import { knex } from "../database"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { checkSessionIdExist } from "../middlewares/check-session-id-exist"

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExist] }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await knex("meals").where("session_id", sessionId).select("*")

    return { meals }
  })

  app.get("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const { sessionId } = request.cookies

    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex("meals")
      .where("id", id)
      .andWhere("session_id", sessionId)
      .first()

    return { meal }
  })

  app.post(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
      })

      const { name, description } = createMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      await knex("meals").insert({
        id: randomUUID(),
        session_id: sessionId,
        name,
        description,
        inside_diet: false,
      })

      return reply.status(201).send()
    }
  )

  app.put(
    "/:id",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      })

      const body = updateMealBodySchema.parse(request.body)

      const dataToUpdate: z.infer<typeof updateMealBodySchema> =
        Object.fromEntries(
          Object.entries(body).filter(([_, value]) => value !== undefined)
        )

      if (Object.keys(dataToUpdate).length === 0) {
        return reply
          .status(400)
          .send({ message: "Nenhum dado enviado para atualizar." })
      }

      await knex("meals")
        .where("id", id)
        .andWhere("session_id", sessionId)
        .update({
          ...dataToUpdate,
          updated_at: new Date().toISOString(),
        })

      return reply.status(201).send()
    }
  )

  app.delete("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const { sessionId } = request.cookies

    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    const meal = await knex("meals")
      .where("id", id)
      .andWhere("session_id", sessionId)
      .delete()

    if (!meal) {
      return { message: "Refeição não encontrada" }
    }

    return { message: "Refeição deletada com  sucesso" }
  })
}
