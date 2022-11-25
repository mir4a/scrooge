export interface ColourIndicatorProps {
  colour?: string;
  className?: string;
}

export default function ColourIndicator({
  colour,
  className,
}: ColourIndicatorProps) {
  return (
    <span
      className={`inline-block h-6 w-6 rounded-full outline outline-1 outline-emerald-500 ${
        colour ? "" : "bg-gray-300"
      } ${className ?? ""}`}
      style={{ ...(colour && { backgroundColor: colour }) }}
    />
  );
}
