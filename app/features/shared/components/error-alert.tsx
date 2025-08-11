interface ErrorAlertProps {
  message?: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  return (
    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
      {message}
    </div>
  );
}
