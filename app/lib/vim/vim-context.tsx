import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";

export type VimMode = "normal" | "command" | "disabled";

export interface VimSettings {
  enabled: boolean;
  showIndicator: boolean;
  commandPrefix: string;
}

interface VimContextType {
  mode: VimMode;
  settings: VimSettings;
  commandInput: string;
  isNavigating: boolean;
  setMode: (mode: VimMode) => void;
  updateSettings: (updates: Partial<VimSettings>) => void;
  setCommandInput: (input: string) => void;
  executeCommand: (command: string) => void;
  setNavigating: (navigating: boolean) => void;
}

const defaultSettings: VimSettings = {
  enabled: false,
  showIndicator: true,
  commandPrefix: ":",
};

const VimContext = createContext<VimContextType | undefined>(undefined);

interface VimProviderProps {
  children: ReactNode;
}

export const VimProvider: FC<VimProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<VimMode>("disabled");
  const [settings, setSettings] = useState<VimSettings>(defaultSettings);
  const [commandInput, setCommandInput] = useState("");
  const [isNavigating, setNavigating] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("vim-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const newSettings = { ...defaultSettings, ...parsed };
        setSettings(newSettings);
        setMode(newSettings.enabled ? "normal" : "disabled");
      } catch (error) {
        console.error("Failed to parse vim settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("vim-settings", JSON.stringify(settings));
    setMode(settings.enabled ? "normal" : "disabled");
  }, [settings]);

  const updateSettings = (updates: Partial<VimSettings>) => {
    setSettings(current => ({ ...current, ...updates }));
  };

  const executeCommand = (command: string) => {
    // Basic vim command implementations
    switch (command.toLowerCase()) {
      case "q":
      case "quit":
        // Close current modal/dialog if any
        const activeDialog = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeDialog) {
          const closeButton = activeDialog.querySelector('[aria-label*="close"], [aria-label*="Close"], .close-button');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
        break;
      
      case "h":
      case "help":
        // Show help dialog
        console.log("Vim help - Available commands: q (quit), h (help), gg (top), G (bottom)");
        break;
      
      case "gg":
        // Go to top
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      
      case "G":
        // Go to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        break;
      
      default:
        console.log(`Unknown command: ${command}`);
    }
    
    setCommandInput("");
    setMode("normal");
  };

  return (
    <VimContext.Provider 
      value={{ 
        mode, 
        settings, 
        commandInput,
        isNavigating,
        setMode, 
        updateSettings, 
        setCommandInput,
        executeCommand,
        setNavigating
      }}
    >
      {children}
    </VimContext.Provider>
  );
};

export const useVim = () => {
  const context = useContext(VimContext);
  if (context === undefined) {
    throw new Error("useVim must be used within a VimProvider");
  }
  return context;
};