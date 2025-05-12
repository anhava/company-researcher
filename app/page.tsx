import CompanyResearcher from "@/components/CompanyResearcher";

export default function Home() {
  return (
    <main className="flex relative min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f5f8ff] to-white">
      {/* Modern grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>

      {/* Floating shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-fainter rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-brand-faint rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-1.5s' }}></div>
      </div>

      <CompanyResearcher />
    </main>
  );
}