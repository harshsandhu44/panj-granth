/**
 * Settings Context
 * Manages app settings and translation preferences with persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@panj_granth_settings";

export interface TranslationSettings {
  showEnglishTranslation: boolean;
  showPunjabiTranslation: boolean;
  showTransliteration: boolean;
  transliterationType: "english" | "devanagari";
}

export interface Settings {
  translation: TranslationSettings;
  // Future settings can be added here
  // theme: 'light' | 'dark' | 'auto';
  // fontSize: 'small' | 'medium' | 'large';
}

interface SettingsContextType {
  settings: Settings;
  updateTranslationSettings: (updates: Partial<TranslationSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  translation: {
    showEnglishTranslation: true, // Default to showing English
    showPunjabiTranslation: false,
    showTransliteration: false,
    transliterationType: "english",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateTranslationSettings = (updates: Partial<TranslationSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        translation: {
          ...prev.translation,
          ...updates,
        },
      };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateTranslationSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
