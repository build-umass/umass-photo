export const OTP_MODES = ["login", "signup"] as const;

export type OtpMode = (typeof OTP_MODES)[number];

export const normalizeOtpMode = (
  mode: string | null | undefined
): OtpMode => (mode === "signup" ? "signup" : "login");

export const getSupabaseOtpType = (
  mode: OtpMode
): "signup" | "email" => (mode === "signup" ? "signup" : "email");


