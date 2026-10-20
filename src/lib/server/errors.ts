/** Foydalanuvchiga ko'rsatiladigan, o'zbekcha xabarli xato. Ichki tafsilotlar (stack, SQL) hech qachon chiqarilmaydi. */
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export const notFound = () => new AppError(404, "not_found", "Taklifnoma topilmadi.");
export const notConfigured = () =>
  new AppError(503, "not_configured", "Server hali sozlanmagan (Supabase ulanmagan). Keyinroq urinib ko‘ring.");

export function toErrorResponse(e: unknown): Response {
  if (e instanceof AppError) {
    return Response.json(
      { error: { code: e.code, message: e.message, fields: e.fields } },
      { status: e.status },
    );
  }
  // Noma'lum xato: tafsilot faqat server logiga, foydalanuvchiga umumiy xabar
  console.error("[api] kutilmagan xato:", e instanceof Error ? e.message : e);
  return Response.json(
    { error: { code: "internal", message: "Kutilmagan xato yuz berdi. Qayta urinib ko‘ring." } },
    { status: 500 },
  );
}
