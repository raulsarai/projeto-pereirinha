import { getSiteSettings } from '@/app/admin/actions'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

// Função para converter Hex para os componentes HSL que o Shadcn espera
function hexToHSL(hex: string) {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  } else { s = 0 }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const adminColor = settings.admin_theme_color || '#22c55e'
  const isDark = settings.admin_dark_mode === 'true'
  const hslValue = hexToHSL(adminColor)

  return (
    // A classe "dark" deve estar no elemento pai para afetar botões e ícones
    <div className={`${isDark ? 'dark' : ''} h-screen bg-background text-foreground transition-colors duration-300`}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root, .dark {
          --accent: ${hslValue};
          --ring: ${hslValue};
          --primary: ${hslValue}; /* Garante que botões primários também mudem */
        }
      `}} />
      <div className="flex h-full overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}