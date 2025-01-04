import { Input } from "@/app/(auth)/_components/input/auth-input";
import { Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { useMemo, useState, useRef } from "react";

type InputSchemaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
  ref: React.Ref<HTMLInputElement>;
  variant?: "default" | "error" | "success";
};

export default function InputSchema({
  value,
  onChange,
  onBlur,
  name,
  ref,
  variant = "default", // پیش‌فرض default
}: InputSchemaProps) {
  const [password, setPassword] = useState(value);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const generateRandomPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const getRandomChar = (charset: string) =>
      charset[Math.floor(Math.random() * charset.length)];

    let generatedPassword = "";

    generatedPassword += getRandomChar(lowercase);
    generatedPassword += getRandomChar(uppercase);
    generatedPassword += getRandomChar(numbers);
    generatedPassword += getRandomChar(specialChars);

    while (generatedPassword.length < 12) {
      const charSets = [lowercase, uppercase, numbers, specialChars];
      generatedPassword += getRandomChar(
        charSets[Math.floor(Math.random() * charSets.length)]
      );
    }

    const shuffledPassword = generatedPassword
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setPassword(shuffledPassword);
    if (onChange) {
      onChange({
        target: {
          value: shuffledPassword,
          name: name,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            variant={variant}
            id="input-51"
            className="pe-9"
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              onChange(e); // Notify react-hook-form
            }}
            onBlur={(e) => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            name={name} // Bind the name attribute for react-hook-form
            ref={(r) => {
              if (ref) {
                // @ts-expect-error - ref is a forwarded ref and TypeScript doesn't recognize it correctly
                ref.current = r;
              }
              inputRef.current = r;
            }}
            aria-invalid={strengthScore < 4}
            aria-describedby="password-strength"
          />
          <div className="absolute inset-y-0 end-0 -mr-2 flex items-center">
            <button
              className="mr-1 p-1.5 rounded-full text-muted-foreground/80 transition-all hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              type="button"
              onClick={generateRandomPassword}
              aria-label="Generate secure password"
            >
              <KeyRound size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            <button
              className="mr-2 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password strength indicator and requirements */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out 
          ${
            isFocused || password
              ? "max-h-96 opacity-100 scale-100 visible"
              : "max-h-0 opacity-0 scale-95 invisible"
          }
        `}
        style={{
          transformOrigin: "top center", // Ensure scaling happens from the top
          transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)", // Smoother easing
        }}
      >
        {/* Strength Progress Bar */}
        <div
          className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Password strength"
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          ></div>
        </div>

        {/* Password strength description */}
        <p
          id="password-strength"
          className="mb-2 text-sm font-medium text-foreground transform transition-all duration-500 ease-out"
          style={{
            transitionDelay: "0.1s", // Slight delay to create a staggered effect
            opacity: isFocused || password ? 1 : 0,
            transform:
              isFocused || password ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        {/* Password requirements list */}
        <ul className="space-y-1.5" aria-label="Password requirements">
          {strength.map((req, index) => (
            <li
              key={index}
              className="flex items-center gap-2 transform transition-all duration-500 ease-out"
              style={{
                transitionDelay: `${index * 100 + 200}ms`, // Staggered animation
                opacity: isFocused || password ? 1 : 0,
                transform:
                  isFocused || password ? "translateX(0)" : "translateX(-10px)",
              }}
            >
              {req.met ? (
                <Check
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${
                  req.met ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}