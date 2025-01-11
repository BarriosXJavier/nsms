"use client";

import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least three characters" })
    .max(10, { message: "username must not exceed eight characters" }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least five characters" }),
  firstName: z
    .string()
    .min(2, { message: "The first name must be at least two characters long" })
    .max(10, { message: "The first name must not exceed ten characters" }),
  lastName: z
    .string()
    .min(2, { message: "The last name must be at least two characters long" })
    .max(10, { message: "The last name must not exceed ten characters" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  address: z.string().min(3, { message: "Address is required" }),
  birthday: z.date({ message: "Birthday is required" }),
  sex: z.enum(["male", "female"], { message: "Sex is required" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  return <form>TeacherForm</form>;
};

export default TeacherForm;
