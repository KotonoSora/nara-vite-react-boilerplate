import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccessibilityProvider, useAccessibility } from "~/lib/accessibility";
import { VimProvider, useVim } from "~/lib/vim/vim-context";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock component to test accessibility hook
function TestAccessibilityComponent() {
  const { settings, updateSettings } = useAccessibility();
  
  return (
    <div>
      <span data-testid="reduce-motion">{settings.reduceMotion.toString()}</span>
      <span data-testid="high-contrast">{settings.highContrast.toString()}</span>
      <button 
        onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
        data-testid="toggle-motion"
      >
        Toggle Motion
      </button>
    </div>
  );
}

// Mock component to test vim hook
function TestVimComponent() {
  const { mode, settings, updateSettings } = useVim();
  
  return (
    <div>
      <span data-testid="vim-mode">{mode}</span>
      <span data-testid="vim-enabled">{settings.enabled.toString()}</span>
      <button 
        onClick={() => updateSettings({ enabled: !settings.enabled })}
        data-testid="toggle-vim"
      >
        Toggle Vim
      </button>
    </div>
  );
}

describe("Accessibility Features", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it("should provide default accessibility settings", () => {
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId("reduce-motion")).toHaveTextContent("false");
    expect(screen.getByTestId("high-contrast")).toHaveTextContent("false");
  });

  it("should update accessibility settings", () => {
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-motion"));
    expect(screen.getByTestId("reduce-motion")).toHaveTextContent("true");
  });

  it("should save settings to localStorage", () => {
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-motion"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "accessibility-settings",
      expect.stringContaining('"reduceMotion":true')
    );
  });
});

describe("Vim Navigation Features", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it("should provide default vim settings", () => {
    render(
      <VimProvider>
        <TestVimComponent />
      </VimProvider>
    );

    expect(screen.getByTestId("vim-mode")).toHaveTextContent("disabled");
    expect(screen.getByTestId("vim-enabled")).toHaveTextContent("false");
  });

  it("should update vim settings", () => {
    render(
      <VimProvider>
        <TestVimComponent />
      </VimProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-vim"));
    expect(screen.getByTestId("vim-enabled")).toHaveTextContent("true");
  });

  it("should save vim settings to localStorage", () => {
    render(
      <VimProvider>
        <TestVimComponent />
      </VimProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-vim"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "vim-settings",
      expect.stringContaining('"enabled":true')
    );
  });
});