import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-blue-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Página não encontrada
      </h1>
      <p className="mt-2 text-gray-600">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Início
      </Link>
    </div>
  );
}
