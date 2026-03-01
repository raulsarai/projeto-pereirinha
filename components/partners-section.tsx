"use client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
}

export function PartnersSection({ data }: { data: string }) {
  const items: Partner[] = JSON.parse(data || "[]");
  if (items.length === 0) return null;

  return (
    <section className="bg-primary py-16 border-y border-border/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-2">
            Nossos Parceiros
          </p>
          <h3 className="text-2xl font-bold text-primary">
            Empresas que confiam em nosso trabalho
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {items.map((partner) => (
            <div 
              key={partner.id} 
              className="w-32 md:w-40 h-20 relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            >
              <img 
                src={partner.logo_url} 
                alt={partner.name} 
                className="max-w-full max-h-full object-contain"
                title={partner.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}