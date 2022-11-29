export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  kind?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  kind = "tertiary",
  size = "medium",
  type = "button",
  onClick,
  className,
  ...props
}: ButtonProps) {
  const buttonClasses = {
    primary: {
      small: "px-2 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    },
    secondary: {
      small: "px-2 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    },
    tertiary: {
      small: "px-2 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    },
  };

  return (
    <button
      type={type}
      {...props}
      onClick={onClick}
      className={`${buttonClasses[kind][size]} ${
        className ?? ""
      } Button Button--${kind}`}
    >
      {children}
    </button>
  );
}
