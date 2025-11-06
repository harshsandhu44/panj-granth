/**
 * TranslationToggle Component
 * Menu for toggling translation preferences
 */

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Menu,
  IconButton,
  Checkbox,
  Text,
  RadioButton,
  Divider,
} from "react-native-paper";
import { useSettings } from "@/contexts/SettingsContext";

export function TranslationToggle() {
  const [visible, setVisible] = useState(false);
  const { settings, updateTranslationSettings } = useSettings();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const {
    showEnglishTranslation,
    showPunjabiTranslation,
    showTransliteration,
    transliterationType,
  } = settings.translation;

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="translate"
          onPress={openMenu}
          size={24}
        />
      }
      anchorPosition="bottom"
    >
      <View style={styles.menuContent}>
        <Text variant="labelLarge" style={styles.menuTitle}>
          Translation Settings
        </Text>

        <Divider style={styles.divider} />

        {/* English Translation */}
        <Checkbox.Item
          label="English Translation"
          status={showEnglishTranslation ? "checked" : "unchecked"}
          onPress={() =>
            updateTranslationSettings({
              showEnglishTranslation: !showEnglishTranslation,
            })
          }
          mode="android"
        />

        {/* Punjabi Translation */}
        <Checkbox.Item
          label="Punjabi Translation"
          status={showPunjabiTranslation ? "checked" : "unchecked"}
          onPress={() =>
            updateTranslationSettings({
              showPunjabiTranslation: !showPunjabiTranslation,
            })
          }
          mode="android"
        />

        {/* Transliteration */}
        <Checkbox.Item
          label="Transliteration"
          status={showTransliteration ? "checked" : "unchecked"}
          onPress={() =>
            updateTranslationSettings({
              showTransliteration: !showTransliteration,
            })
          }
          mode="android"
        />

        {/* Transliteration Type (only show if transliteration is enabled) */}
        {showTransliteration && (
          <>
            <Divider style={styles.divider} />
            <Text variant="labelMedium" style={styles.subTitle}>
              Transliteration Style
            </Text>

            <RadioButton.Item
              label="Roman (English)"
              value="english"
              status={transliterationType === "english" ? "checked" : "unchecked"}
              onPress={() =>
                updateTranslationSettings({ transliterationType: "english" })
              }
              mode="android"
            />

            <RadioButton.Item
              label="Devanagari"
              value="devanagari"
              status={transliterationType === "devanagari" ? "checked" : "unchecked"}
              onPress={() =>
                updateTranslationSettings({ transliterationType: "devanagari" })
              }
              mode="android"
            />
          </>
        )}
      </View>
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuContent: {
    minWidth: 280,
  },
  menuTitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: "600",
  },
  subTitle: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 4,
  },
});
