import Link from "next/link";
import { Coins, Instagram, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const platformLinks = [
  { label: "Para Atletas", href: "/athletes" },
  { label: "Para Organizadores", href: "/organizers" },
  { label: "Para Marcas", href: "/brands" },
  { label: "Para Fans", href: "/fans" },
  { label: "Para Apostadores", href: "/bettors" },
  { label: "Para Arbitros", href: "/referees" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "GCoins", href: "/gcoins" },
  { label: "Torneios", href: "/tournaments" },
  { label: "Ranking", href: "/ranking" },
  { label: "Loja", href: "/store" },
];

const companyLinks = [
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
  { label: "Termos", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/sportio", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/sportio", icon: Twitter },
  { label: "Youtube", href: "https://youtube.com/sportio", icon: Youtube },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5">
        {title}
      </h3>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-8 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Sportio</span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              A plataforma completa que conecta atletas, organizadores, marcas,
              fas e apostadores no mundo do esporte.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    "bg-white/5 text-slate-400 transition-all",
                    "hover:bg-emerald-500/20 hover:text-emerald-400 hover:scale-110"
                  )}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup title="Plataforma" links={platformLinks} />
          <FooterLinkGroup title="Recursos" links={resourceLinks} />
          <FooterLinkGroup title="Empresa" links={companyLinks} />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-10 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; 2025 Sportio. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            A moeda digital do esporte:
            <span className="font-bold text-emerald-400">GCoins</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
