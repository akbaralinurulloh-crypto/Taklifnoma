"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Xato tafsilotlari (stack, xabar) foydalanuvchiga ko'rsatilmaydi
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-serif text-2xl text-ink">Kutilmagan xato yuz berdi</h1>
      <p className="mt-2 text-sm text-muted">Sahifani yuklab bo‘lmadi. Qayta urinib ko‘ring.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-gold-dark px-6 py-2 text-sm text-white hover:bg-gold">
        Qayta urinish
      </button>
    </main>
  );
}
