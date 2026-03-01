"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SocialSettings({ settings, setSettings }: any) {
  const platforms = ["instagram", "facebook", "youtube", "whatsapp", "telegram", "twitter"];
  return (
    <Card className="mt-6">
      <CardContent className="space-y-4 pt-6">
        {platforms.map(p => (
          <div key={p} className="flex items-center gap-4 border-b pb-4 last:border-0">
            <div className="flex-1">
              <Label className="capitalize">{p}</Label>
              <Input value={settings[`social_${p}_url`] || ""} onChange={(e) => setSettings({ ...settings, [`social_${p}_url`]: e.target.value })} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label className="text-[10px] uppercase font-bold opacity-50">Ativo</Label>
              <Switch checked={settings[`social_${p}_active`] === "true"} onCheckedChange={(c) => setSettings({ ...settings, [`social_${p}_active`]: String(c) })} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}