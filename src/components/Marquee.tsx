export default function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="animate-marquee whitespace-nowrap will-change-transform">
        <span className="mx-8 inline-block">{children}</span>
        <span className="mx-8 inline-block">{children}</span>
        <span className="mx-8 inline-block">{children}</span>
        <span className="mx-8 inline-block">{children}</span>
      </div>
    </div>
  );
}

