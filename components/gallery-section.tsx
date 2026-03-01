"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function GallerySection({ dataJson }: { dataJson: string }) {
  const data = JSON.parse(dataJson || '{"layout": "grid", "images": []}');
  const images = data.images || [];

  if (images.length === 0) return null;

  return (
    <section className="bg-primary py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl mb-4 text-primary">
            Galeria do Projeto
          </h2>
          <div className="mx-auto h-1 w-20 bg-accent" />
        </div>

        {/* Layout: Grade Simples */}
        {data.layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img: any) => (
              <div key={img.id} className="aspect-square rounded-2xl overflow-hidden border border-border/50 bg-card">
                <img src={img.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Galeria" />
              </div>
            ))}
          </div>
        )}

        {/* Layout: Slider */}
        {data.layout === "slider" && (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((img: any) => (
                <CarouselItem key={img.id}>
                  <div className="aspect-video rounded-3xl overflow-hidden border shadow-xl bg-card">
                    <img src={img.url} className="w-full h-full object-cover" alt="Galeria" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-primary border-border/50" />
            <CarouselNext className="text-primary border-border/50" />
          </Carousel>
        )}

        {/* Layout: Mosaico Dinâmico */}
        {data.layout === "mosaic" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img: any) => (
              <div key={img.id} className="break-inside-avoid rounded-2xl overflow-hidden border bg-card">
                <img src={img.url} className="w-full h-auto object-cover hover:opacity-80 transition-opacity" alt="Galeria" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}