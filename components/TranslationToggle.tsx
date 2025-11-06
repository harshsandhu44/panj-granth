/**
 * TranslationToggle Component
 * Dialog for toggling translation preferences
 */

import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Portal,
  Dialog,
  IconButton,
  Checkbox,
  Text,
  RadioButton,
  Divider,
  Button,
} from "react-native-paper";
import { useSettings } from "@/contexts/SettingsContext";

export function TranslationToggle() {
  const [visible, setVisible] = useState(false);
  const { settings, updateTranslationSettings } = useSettings();

  const openDialog = () => setVisible(true);
  const closeDialog = () => setVisible(false);

  const {
    showEnglishTranslation,
    showPunjabiTranslation,
    showTransliteration,
    transliterationType,
  } = settings.translation;

  return (
    <>
      <IconButton icon="translate" onPress={openDialog} size={24} />

      <Portal>
        <Dialog visible={visible} onDismiss={closeDialog}>
          <Dialog.Title>Translation Settings</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <View style={styles.dialogContent}>
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
                      status={
                        transliterationType === "english" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        updateTranslationSettings({
                          transliterationType: "english",
                        })
                      }
                      mode="android"
                    />

                    <RadioButton.Item
                      label="Devanagari"
                      value="devanagari"
                      status={
                        transliterationType === "devanagari"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        updateTranslationSettings({
                          transliterationType: "devanagari",
                        })
                      }
                      mode="android"
                    />
                  </>
                )}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
  },
  subTitle: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 8,
  },
});
