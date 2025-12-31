import { ReactNode } from "react";

export default function UmassPhotoButton({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <button
      className={`${className ?? ""} cursor-camera rounded-2xl px-5 py-2 text-3xl font-bold text-white`}
      {...props}
    >
      {children}
    </button>
  );
}
