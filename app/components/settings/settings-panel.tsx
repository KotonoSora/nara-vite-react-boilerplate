import { type FC, useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useAccessibility } from "~/lib/accessibility";
import { useVim } from "~/lib/vim/vim-context";
import { cn } from "~/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings: accessibilitySettings, updateSettings: updateAccessibilitySettings, resetSettings: resetAccessibilitySettings } = useAccessibility();
  const { settings: vimSettings, updateSettings: updateVimSettings } = useVim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full mx-4 border shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Accessibility & Navigation Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Accessibility Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Accessibility</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion" className="text-sm">
                  Reduce Motion
                  <span className="block text-xs text-muted-foreground">
                    Minimize animations and transitions
                  </span>
                </Label>
                <Switch
                  id="reduce-motion"
                  checked={accessibilitySettings.reduceMotion}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ reduceMotion: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm">
                  High Contrast
                  <span className="block text-xs text-muted-foreground">
                    Increase color contrast for better visibility
                  </span>
                </Label>
                <Switch
                  id="high-contrast"
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ highContrast: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="text-sm">
                  Large Text
                  <span className="block text-xs text-muted-foreground">
                    Increase text size for better readability
                  </span>
                </Label>
                <Switch
                  id="large-text"
                  checked={accessibilitySettings.largeText}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ largeText: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-navigation" className="text-sm">
                  Enhanced Keyboard Navigation
                  <span className="block text-xs text-muted-foreground">
                    Improve keyboard navigation experience
                  </span>
                </Label>
                <Switch
                  id="keyboard-navigation"
                  checked={accessibilitySettings.keyboardNavigation}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ keyboardNavigation: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="text-sm">
                  Screen Reader Optimized
                  <span className="block text-xs text-muted-foreground">
                    Optimize interface for screen readers
                  </span>
                </Label>
                <Switch
                  id="screen-reader"
                  checked={accessibilitySettings.screenReaderOptimized}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ screenReaderOptimized: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="focus-indicators" className="text-sm">
                  Enhanced Focus Indicators
                  <span className="block text-xs text-muted-foreground">
                    Show clear focus indicators for navigation
                  </span>
                </Label>
                <Switch
                  id="focus-indicators"
                  checked={accessibilitySettings.focusIndicators}
                  onCheckedChange={(checked) => 
                    updateAccessibilitySettings({ focusIndicators: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Vim Navigation Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Vim Navigation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vim-enabled" className="text-sm">
                  Enable Vim Navigation
                  <span className="block text-xs text-muted-foreground">
                    Use vim-style keyboard shortcuts (j/k/h/l)
                  </span>
                </Label>
                <Switch
                  id="vim-enabled"
                  checked={vimSettings.enabled}
                  onCheckedChange={(checked) => 
                    updateVimSettings({ enabled: checked })
                  }
                />
              </div>

              {vimSettings.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vim-indicator" className="text-sm">
                      Show Mode Indicator
                      <span className="block text-xs text-muted-foreground">
                        Display current vim mode in corner
                      </span>
                    </Label>
                    <Switch
                      id="vim-indicator"
                      checked={vimSettings.showIndicator}
                      onCheckedChange={(checked) => 
                        updateVimSettings({ showIndicator: checked })
                      }
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Vim Keys Quick Reference</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div><kbd className="px-1 py-0.5 bg-background rounded">j/k</kbd> - Up/Down navigation</div>
                      <div><kbd className="px-1 py-0.5 bg-background rounded">h/l</kbd> - Left/Right navigation</div>
                      <div><kbd className="px-1 py-0.5 bg-background rounded">:</kbd> - Command mode</div>
                      <div><kbd className="px-1 py-0.5 bg-background rounded">:q</kbd> - Close/Quit</div>
                      <div><kbd className="px-1 py-0.5 bg-background rounded">gg/G</kbd> - Top/Bottom of page</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetAccessibilitySettings}
              className="flex-1"
            >
              Reset Accessibility
            </Button>
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Save & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsToggle: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility and navigation settings"
        className="fixed bottom-4 left-4 z-40 rounded-full shadow-lg"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      <SettingsPanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};