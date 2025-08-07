import { type FC } from "react";
import { useVim } from "~/lib/vim/vim-context";
import { cn } from "~/lib/utils";

export const VimIndicator: FC = () => {
  const { mode, settings, commandInput } = useVim();

  if (!settings.enabled || !settings.showIndicator || mode === "disabled") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {/* Mode indicator */}
      <div
        className={cn(
          "rounded-md px-3 py-1 text-xs font-medium transition-all",
          mode === "normal" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          mode === "command" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        )}
      >
        {mode === "normal" && "NORMAL"}
        {mode === "command" && "COMMAND"}
      </div>

      {/* Command input display */}
      {mode === "command" && (
        <div className="rounded-md bg-background border px-3 py-1 text-xs font-mono min-w-[100px]">
          <span className="text-muted-foreground">{settings.commandPrefix}</span>
          <span>{commandInput}</span>
          <span className="animate-pulse">|</span>
        </div>
      )}
    </div>
  );
};

interface VimHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VimHelp: FC<VimHelpProps> = ({ isOpen, onClose }) => {
  const { settings } = useVim();

  if (!isOpen || !settings.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Vim Navigation Help</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close help"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Navigation Keys</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">j</kbd> - Move down</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">k</kbd> - Move up</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">h</kbd> - Move left</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">l</kbd> - Move right</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">gg</kbd> - Go to top</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">G</kbd> - Go to bottom</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Commands</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">:</kbd> - Enter command mode</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">:q</kbd> - Quit/close</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">:h</kbd> - Show help</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Return to normal mode</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Actions</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Activate focused element</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Activate focused element</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Navigate to next element</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};