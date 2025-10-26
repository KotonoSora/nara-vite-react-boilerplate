import {
  lowercaseSchema,
  minLengthSchema,
  numberSchema,
  specialCharSchema,
  uppercaseSchema,
} from "../../constants/common";

/**
 * Checks if a password is strong based on defined criteria.
 *
 * @param password - The password to check.
 * @returns An object containing the validation result and requirements.
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: minLengthSchema.safeParse(password).success,
    hasUppercase: uppercaseSchema.safeParse(password).success,
    hasLowercase: lowercaseSchema.safeParse(password).success,
    hasNumber: numberSchema.safeParse(password).success,
    hasSpecialChar: specialCharSchema.safeParse(password).success,
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { isValid, requirements };
}
