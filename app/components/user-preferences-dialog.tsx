import {
  Eye,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  Type,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserPreferences } from "~/hooks/use-user-preferences";
import { availableFonts, fontSizeOptions } from "~/lib/user-preferences";

export function UserPreferencesDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const [theme, setTheme] = useTheme();

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system') {
      updatePreferences({ colorTheme: newTheme as 'light' | 'dark' | 'system' });
      // The actual theme application will be handled by the UserPreferencesProvider
    }
  };

  const playSound = () => {
    if (preferences.soundEnabled) {
      // Simple click sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="group/settings h-8 w-8 px-0 cursor-pointer"
          aria-label="Open user preferences"
          onClick={playSound}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            User Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your experience with font styles, colors, accessibility options, and more.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Theme
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={preferences.colorTheme === 'light' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={preferences.colorTheme === 'dark' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
                <Button
                  variant={preferences.colorTheme === 'system' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  System
                </Button>
              </div>
            </div>

            <Separator />

            {/* Font Family */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Family
              </Label>
              <Select
                value={preferences.fontFamily}
                onValueChange={(value) => updatePreferences({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.name} value={font.name}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Font Size: {fontSizeOptions.find(opt => opt.value === preferences.fontSize)?.label}
              </Label>
              <Slider
                value={[preferences.fontSize]}
                onValueChange={([value]) => updatePreferences({ fontSize: value })}
                min={0.75}
                max={1.25}
                step={0.125}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Default</span>
                <span>Large</span>
              </div>
            </div>

            <Separator />

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Compact Mode</Label>
              <Switch
                checked={preferences.compactMode}
                onCheckedChange={(checked) => updatePreferences({ compactMode: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Reduce Motion
                </Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions for better accessibility
                </p>
              </div>
              <Switch
                checked={preferences.reducedMotion}
                onCheckedChange={(checked) => updatePreferences({ reducedMotion: checked })}
              />
            </div>

            <Separator />

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  High Contrast
                </Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                checked={preferences.highContrast}
                onCheckedChange={(checked) => updatePreferences({ highContrast: checked })}
              />
            </div>

            <Separator />

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  {preferences.soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  Sound Effects
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable audio feedback for interactions
                </p>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) => {
                  updatePreferences({ soundEnabled: checked });
                  if (checked) playSound();
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Reset all customizations to default values.
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  resetPreferences();
                  playSound();
                }}
              >
                Reset All Preferences
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Settings Preview</h4>
              <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-1">
                <div>Font: {preferences.fontFamily}</div>
                <div>Size: {preferences.fontSize}x</div>
                <div>Theme: {preferences.colorTheme}</div>
                <div>Compact: {preferences.compactMode ? 'Yes' : 'No'}</div>
                <div>Reduced Motion: {preferences.reducedMotion ? 'Yes' : 'No'}</div>
                <div>High Contrast: {preferences.highContrast ? 'Yes' : 'No'}</div>
                <div>Sound: {preferences.soundEnabled ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}