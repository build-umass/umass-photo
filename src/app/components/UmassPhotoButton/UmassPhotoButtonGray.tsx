import { ButtonProps } from "./types";

export default function UmassPhotoButtonGray({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ButtonProps) {
  if (props.disabled) {
    return (
      <button
        className={
          "bg-umass-gray-light rounded-default cursor-not-allowed px-5 py-2 text-xl font-bold text-white transition-colors duration-500"
        }
        {...props}
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className={
          "cursor-camera bg-umass-gray hover:bg-umass-gray-dark rounded-default px-5 py-2 text-xl font-bold text-white transition-colors duration-500"
        }
        {...props}
      >
        {children}
      </button>
    );
  }
}
