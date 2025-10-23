import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import formSchema from "../type/formSchema"

function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: undefined,
      phone: undefined,
      type: "email",
    },
  })

  const watchType = form.watch("type")

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form data:", data)
    form.reset();  //rese values
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email (conditionally show) */}
        {watchType === "email" && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="test@example.com" {...field} />
                </FormControl>
                <FormDescription>Enter a valid email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Phone (conditionally show) */}
        {watchType === "phone" && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormDescription>Enter your phone in international format.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Type (email or phone) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Contact Method</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded p-2">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </FormControl>
              <FormDescription>Select how you'd like to be contacted.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default App
