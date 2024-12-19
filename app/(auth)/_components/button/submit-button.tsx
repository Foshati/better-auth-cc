import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button"; // فرض کنید ButtonProps تعریف شده باشد

interface LoadingButtonProps extends ButtonProps {
  pending: boolean;
  onClick?: () => void;
}

export default function SubmitButton({
  pending,
  children,
  onClick,
  disabled = false,
  className,
  ...rest
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={className || ""}
      disabled={pending || disabled}
      {...rest} // انتقال باقی props
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
