import { Knex } from "knex"

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      type: "credit" | "debit"
      created_at: string
      session_id?: string
    }
    users: {
      id: string
      name: string
      email: string
      session_id?: string
      created_at: string
    }
    meals: {
      id: string
      session_id: string
      name: string
      description?: string
      inside_diet: boolean
      created_at: string
      updated_at?: string
    }
    diets: {
      id: string
      session_id: string
      name: string
      description?: string
      created_at: string
      updated_at?: string
    }
  }
}
