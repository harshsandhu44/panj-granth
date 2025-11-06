/**
 * GurbaniLine Component
 * Displays a single line of Gurbani with conditional translations
 */

import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { TransformedLine } from "@/services/transformers";
import { useSettings } from "@/contexts/SettingsContext";

interface GurbaniLineProps {
  line: TransformedLine;
  showLineNumber?: boolean;
}

export function GurbaniLine({ line, showLineNumber = false }: GurbaniLineProps) {
  const theme = useTheme();
  const { settings } = useSettings();

  const {
    showEnglishTranslation,
    showPunjabiTranslation,
    showTransliteration,
    transliterationType,
  } = settings.translation;

  return (
    <View style={styles.container}>
      {/* Line number (optional) */}
      {showLineNumber && (
        <Text
          variant="labelSmall"
          style={[styles.lineNumber, { color: theme.colors.outline }]}
        >
          {line.lineNumber}
        </Text>
      )}

      {/* Gurmukhi text (always shown) */}
      <Text
        variant="bodyLarge"
        style={[
          styles.gurmukhi,
          {
            color: theme.colors.onSurface,
            fontWeight: line.type === 1 ? "600" : "normal",
          },
        ]}
      >
        {line.gurmukhi}
      </Text>

      {/* Transliteration */}
      {showTransliteration && (
        <Text
          variant="bodyMedium"
          style={[styles.transliteration, { color: theme.colors.onSurfaceVariant }]}
        >
          {transliterationType === "english"
            ? line.transliteration
            : line.transliterationDevanagari}
        </Text>
      )}

      {/* English Translation */}
      {showEnglishTranslation && line.englishTranslation && (
        <Text
          variant="bodyMedium"
          style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}
        >
          {line.englishTranslation}
        </Text>
      )}

      {/* Punjabi Translation */}
      {showPunjabiTranslation && line.punjabiTranslation && (
        <Text
          variant="bodyMedium"
          style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}
        >
          {line.punjabiTranslation}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  lineNumber: {
    marginBottom: 4,
  },
  gurmukhi: {
    lineHeight: 28,
    fontSize: 18,
  },
  transliteration: {
    lineHeight: 22,
    fontStyle: "italic",
  },
  translation: {
    lineHeight: 22,
  },
});
