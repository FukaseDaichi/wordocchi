import Link from "next/link";

export default function NotFound() {
  return (
    <main className="safe-screen flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm rounded-3xl bg-cream-100 p-6 text-center shadow-card">
        <p className="font-rounded text-2xl font-extrabold text-ink-900">
          ページが見つかりません
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          ワードッチの進行ツールはトップページだけで遊べます。
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-leaf-500 px-6 font-rounded font-bold text-white shadow-cta"
        >
          トップへ戻る
        </Link>
      </section>
    </main>
  );
}
