import { useState } from "react";

/**
 * Hook for managing password visibility toggle
 */
export function usePasswordVisibility(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggle = () => setIsVisible(!isVisible);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    toggle,
    show,
    hide,
    type: isVisible ? "text" : "password",
  };
}

/**
 * Hook for managing form submission state
 */
export function useFormSubmission(initialSubmitting = false) {
  const [isSubmitting, setIsSubmitting] = useState(initialSubmitting);
  const [error, setError] = useState<string | null>(null);

  const startSubmission = () => {
    setIsSubmitting(true);
    setError(null);
  };

  const finishSubmission = () => {
    setIsSubmitting(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSubmitting(false);
  };

  const reset = () => {
    setIsSubmitting(false);
    setError(null);
  };

  return {
    isSubmitting,
    error,
    startSubmission,
    finishSubmission,
    handleError,
    reset,
  };
}

/**
 * Hook for managing loading states with optional delay
 */
export function useLoadingState(initialLoading = false, minDelay = 0) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const setLoading = async (loading: boolean) => {
    if (loading) {
      setIsLoading(true);
    } else {
      if (minDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, minDelay));
      }
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setLoading,
    startLoading: () => setLoading(true),
    stopLoading: () => setLoading(false),
  };
}

/**
 * Hook for managing toggle states
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(!value);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}