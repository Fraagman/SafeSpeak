export default function Glow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,.25),transparent_60%)] blur-3xl" />
      <div className="absolute -bottom-40 right-10 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,.18),transparent_60%)] blur-3xl" />
    </div>
  );
}

