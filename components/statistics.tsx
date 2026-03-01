"use client"

import { useEffect, useState } from "react"
import * as LucideIcons from "lucide-react"
import { LucideIcon, BarChart3 } from "lucide-react"

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  suffix?: string;
}

function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 1500
    const step = target / (duration / 16)
    let frame = 0

    const interval = setInterval(() => {
      frame += step
      if (frame >= target) {
        setCurrent(target)
        clearInterval(interval)
      } else {
        setCurrent(Math.floor(frame))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [target])

  return <>{current.toLocaleString("pt-BR")}</>
}

export function Statistics({ dataJson }: { dataJson: string }) {
  const [items, setItems] = useState<StatItem[]>([])

  useEffect(() => {
    try {
      setItems(JSON.parse(dataJson || "[]"))
    } catch (e) {
      setItems([])
    }
  }, [dataJson])

  if (items.length === 0) return null

  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item) => {
            // Solução para o erro ts(2604): Cast para LucideIcon
            const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcon) || BarChart3;
            
            return (
              <div
                key={item.id}
                className="flex w-full sm:w-[45%] lg:flex-1 flex-col items-center gap-4 rounded-3xl bg-card p-8 border border-border/50 shadow-sm transition-all hover:translate-y-[-4px]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <IconComponent size={28} />
                </div>
                <div className="text-center">
                  <span className="block font-display text-4xl font-black text-secondary">
                    <AnimatedNumber target={parseInt(item.value) || 0} />
                    {item.suffix}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary mt-2 block opacity-70">
                    {item.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}