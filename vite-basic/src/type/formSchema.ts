import { z } from "zod"

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),

    email: z
      .string()
      .min(1, { message: "Email is required." }) // prevent empty string
      .email({ message: "Email must be valid." })
      .optional(),

    phone: z
      .string()
      .min(1, { message: "Phone is required." }) // prevent empty string
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format.",
      })
      .optional(),

    type: z.enum(["phone", "email"]),
  })
  .refine(
    (data) => data.type !== "email" || !!data.email,
    {
      message: "Email is required when type is set to 'email'.",
      path: ["email"],
    }
  )
  .refine(
    (data) => data.type !== "phone" || !!data.phone,
    {
      message: "Phone is required when type is set to 'phone'.",
      path: ["phone"],
    }
  )

export default formSchema
