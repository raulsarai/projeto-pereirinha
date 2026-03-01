"use client";

import { cn } from "@/lib/utils";

interface BookingProps {
  type: "calendly" | "google";
  url: string;
  title: string;
  description: string;
}

export function BookingSection({ type, url, title, description }: BookingProps) {
  if (!url) return null;

  return (
    <section id="agendamento" className="bg-background py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-black uppercase md:text-4xl mb-4 text-primary">
            {title}
          </h2>
          <p className="text-primary opacity-50 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative w-full rounded-3xl overflow-hidden border border-border bg-card shadow-xl min-h-[600px]">
          {type === "calendly" ? (
            <iframe
              src={`${url}?hide_event_type_details=1&hide_gdpr_banner=1`}
              width="100%"
              height="600"
              frameBorder="0"
            ></iframe>
          ) : (
            <iframe
              src={url}
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
}