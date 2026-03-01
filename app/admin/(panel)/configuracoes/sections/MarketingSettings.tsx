"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function MarketingSettings({ settings, setSettings }: any) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader><CardTitle>Rastreamento e Pixels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Google Analytics ID</Label>
            <Input value={settings.marketing_ga_id || ""} onChange={(e) => setSettings({ ...settings, marketing_ga_id: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Facebook Pixel ID</Label>
            <Input value={settings.marketing_fb_pixel_id || ""} onChange={(e) => setSettings({ ...settings, marketing_fb_pixel_id: e.target.value })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}