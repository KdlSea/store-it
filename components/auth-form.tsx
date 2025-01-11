"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.action";
import OtpModal from "@/components/otp-modal";

type Formtype = "signin" | "signup";

const authForm = (formType: Formtype) => {
  return z.object({
    email: z.string().email(),
    fullname:
      formType === "signup" ? z.string().min(2).max(50) : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: Formtype }) => {
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authForm(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setisLoading(true);
    seterrorMessage("");
    try {
      const user =
        type === "signup"
          ? await createAccount({
              fullName: values.fullname || "",
              email: values.email || "",
            })
          : await signInUser({ email: values.email });

      setAccountId(user.accountId);
    } catch {
      seterrorMessage("Failed to create account");
    } finally {
      setisLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8
      auth-form"
        >
          <h1 className="form-title">
            {type === "signin" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "signup" && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your
                    Full Name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your
                    Email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "signin" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "signin"
                ? "Don't have an account?"
                : "" + "Already have an account?"}
            </p>
            {type === "signin" ? (
              <Link
                href="/sign-up"
                className="ml-1 font-medium
            text-brand"
              >
                {" "}
                SignUp
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="ml-1 font-medium
            text-brand"
              >
                {" "}
                SignIn
              </Link>
            )}
          </div>
        </form>
      </Form>
      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
