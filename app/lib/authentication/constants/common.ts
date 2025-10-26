import { z } from "zod";

// Define individual validation schemas for each requirement
export const minLengthSchema = z.string().min(8);
export const uppercaseSchema = z.string().regex(/[A-Z]/);
export const lowercaseSchema = z.string().regex(/[a-z]/);
export const numberSchema = z.string().regex(/\d/);
export const specialCharSchema = z.string().regex(/[!@#$%^&*(),.?":{}|<>]/);
