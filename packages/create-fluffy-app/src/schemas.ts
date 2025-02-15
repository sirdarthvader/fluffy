import { z } from "zod";

export const ProjectOptionsSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters long!")
    .max(30, "project name must be at most 30 characters long!")
    .regex(
      /^[a-z0-9-]+$/,
      "Project name must be lowercase and contain only letters, numbers and dashes!"
    ),
  features: z.array(
    z.enum(["typescript", "tailwindcss", "eslint", "prettier"])
  ),
});

export type ProjectOptions = z.infer<typeof ProjectOptionsSchema>;
