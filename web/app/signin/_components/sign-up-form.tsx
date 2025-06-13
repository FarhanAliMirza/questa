import { useId, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signupShema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type SignupFormValues = z.infer<typeof signupShema>;

export const SignUpForm = () => {
  const router = useRouter();
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupShema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Signup successful !");
          router.push("/user");
        },
        onError: () => {
          setIsLoading(false);
          toast.error("Something went wrong, please try again !");
        },
      }
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full gap-2"
        >
          <div className="flex flex-col gap-2 mb-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Signup</CardTitle>
              <CardDescription>
                Create an account to start creating quizzes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id={id}
                          className="pe-9"
                          placeholder="Password"
                          type={isVisible ? "text" : "password"}
                          {...field}
                        />
                        <button
                          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isVisible}
                          aria-controls="password"
                        >
                          {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                          ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </div>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
