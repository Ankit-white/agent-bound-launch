const logoAsset = "/assets/bitboundpay_logo.png";

export function Footer() {
  const links = [
    { label: "GitHub", href: "#" },
    { label: "Discord", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter/X", href: "#" },
  ];

  return (
    <footer className="border-t border-border px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="h-8 w-8 overflow-hidden rounded-[0.35rem]">
            <img
              src={logoAsset}
              alt="BitBoundPay"
              className="block h-full w-full object-contain"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The AI Agent Operating System</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-4 sm:flex sm:flex-wrap sm:gap-8">
          {[{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }, ...links].map(
            (l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} BitBoundPay
      </p>
    </footer>
  );
}
