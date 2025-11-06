/**
 * ErrorView Component
 * Display error states with retry functionality
 */

import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme, Icon } from "react-native-paper";

interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: string;
}

export function ErrorView({
  title = "Something went wrong",
  message,
  onRetry,
  icon = "alert-circle-outline",
}: ErrorViewProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Icon source={icon} size={64} color={theme.colors.error} />

        <Text variant="headlineSmall" style={styles.title}>
          {title}
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          {message}
        </Text>

        {onRetry && (
          <Button mode="contained" onPress={onRetry} style={styles.button}>
            Try Again
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    maxWidth: 400,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});
