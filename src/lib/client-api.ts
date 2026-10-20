export class ApiError extends Error {
  constructor(message: string, public fields?: Record<string, string>, public status?: number) {
    super(message);
  }
}

/** Server bilan haqiqiy so'rov. Tarmoq xatosi ham, server xatosi ham foydalanuvchiga o'zbekcha ko'rsatiladi. */
export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new ApiError("Internet aloqasi yo‘q yoki server javob bermadi. Qayta urinib ko‘ring.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error?.message ?? "Xato yuz berdi. Qayta urinib ko‘ring.", data?.error?.fields, res.status);
  }
  return data as T;
}

export function randomToken(bytes: number): string {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
