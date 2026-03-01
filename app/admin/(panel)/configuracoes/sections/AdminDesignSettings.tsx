"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Palette } from "lucide-react";
import { updateSiteSetting } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function AdminDesignSettings({ settings, setSettings }: any) {
  const router = useRouter();

  const handleDarkMode = async (checked: boolean) => {
    const val = String(checked);
    setSettings((prev: any) => ({ ...prev, admin_dark_mode: val }));
    await updateSiteSetting("admin_dark_mode", val);
    router.refresh();
  };

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="text-accent" size={18}/> Aparência do Painel</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Label>Cor de Destaque do Admin (Accent)</Label>
            <div className="flex gap-2">
              <Input 
                type="color" 
                className="w-14 h-10 p-1" 
                value={settings.admin_theme_color || "#22c55e"} 
                onChange={(e) => setSettings({ ...settings, admin_theme_color: e.target.value })} 
              />
              <Input value={settings.admin_theme_color || "#22c55e"} readOnly className="flex-1" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/5">
            <div className="flex items-center gap-2">
              {settings.admin_dark_mode === "true" ? <Moon size={18} /> : <Sun size={18} />}
              <span className="font-medium">Modo Escuro do Admin</span>
            </div>
            <Switch checked={settings.admin_dark_mode === "true"} onCheckedChange={handleDarkMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}