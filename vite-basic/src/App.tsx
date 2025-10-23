import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import formSchema from "./type/formSchema"

function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      type: "email",
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form

  const watchType = watch("type")

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form data:", data)
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Username */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register("username")}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          {/* Email */}
          {watchType === "email" && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email")}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          )}

          {/* Phone */}
          {watchType === "phone" && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                {...register("phone")}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          )}

          {/* Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Contact Type</label>
            <select
              {...register("type")}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default App

