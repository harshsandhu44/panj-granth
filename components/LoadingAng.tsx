/**
 * LoadingAng Component
 * Loading skeleton for Ang screen
 */

import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Surface, useTheme } from "react-native-paper";

export function LoadingAng() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Loading indicator */}
        <ActivityIndicator size="large" style={styles.indicator} />

        {/* Skeleton lines */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Surface
            key={i}
            style={[
              styles.skeletonLine,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={0}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  indicator: {
    marginVertical: 32,
  },
  skeletonLine: {
    height: 60,
    marginBottom: 16,
    borderRadius: 8,
  },
});
