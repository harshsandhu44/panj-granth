import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  Text,
  Card,
  Button,
  Appbar,
  useTheme,
  Surface,
  List,
  Portal,
  Dialog,
  TextInput,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import {
  getMockReadingHistory,
  formatRelativeTime,
  getRandomAngNumber,
} from "@/services/mock-data";
import { useHukamnama } from "@/hooks/useHukamnama";
import { getPreviewText } from "@/services/transformers";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { hukamnama, loading: hukamnamaLoading } = useHukamnama();
  const readingHistory = getMockReadingHistory();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [angNumber, setAngNumber] = useState("");

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setAngNumber("");
  };

  const handleGoToAng = () => {
    const num = parseInt(angNumber, 10);
    if (num >= 1 && num <= 1430) {
      hideDialog();
      router.push(`/ang/${num}`);
    }
  };

  const handleContinueReading = () => {
    if (readingHistory.length > 0) {
      router.push(`/ang/${readingHistory[0].angNumber}`);
    }
  };

  const handleRandomAng = () => {
    const randomAng = getRandomAngNumber();
    router.push(`/ang/${randomAng}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Panj Granth" />
        <Appbar.Action icon="magnify" onPress={() => router.push("/search")} />
        <Appbar.Action icon="cog-outline" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Daily Hukamnama Card */}
        <Card style={styles.hukamnamaCard} mode="elevated">
          {hukamnamaLoading ? (
            <Card.Content>
              <Text variant="labelMedium" style={styles.cardLabel}>
                TODAY&apos;S HUKAMNAMA
              </Text>
              <ActivityIndicator size="large" style={styles.loadingIndicator} />
            </Card.Content>
          ) : hukamnama ? (
            <View>
              <Card.Content>
                <Text variant="labelMedium" style={styles.cardLabel}>
                  TODAY&apos;S HUKAMNAMA
                </Text>
                <Text
                  variant="headlineSmall"
                  style={[styles.cardTitle, { color: theme.colors.primary }]}
                >
                  Ang {hukamnama.pageNumber}
                </Text>
                <Text
                  variant="bodyMedium"
                  numberOfLines={3}
                  style={[
                    styles.preview,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {getPreviewText(hukamnama.lines, 120)}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => router.push("/hukamnama")}
                  style={styles.readButton}
                >
                  Read Full
                </Button>
              </Card.Actions>
            </View>
          ) : (
            <Card.Content>
              <Text variant="labelMedium" style={styles.cardLabel}>
                TODAY&apos;S HUKAMNAMA
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                Unable to load Hukamnama
              </Text>
            </Card.Content>
          )}
        </Card>

        {/* Quick Actions */}
        <Surface style={styles.quickActions} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              mode="contained-tonal"
              icon="book-open-page-variant"
              onPress={handleContinueReading}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Continue
            </Button>
            <Button
              mode="contained-tonal"
              icon="numeric"
              onPress={showDialog}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Go to Ang
            </Button>
            <Button
              mode="contained-tonal"
              icon="shuffle-variant"
              onPress={handleRandomAng}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Random
            </Button>
            <Button
              mode="contained-tonal"
              icon="bookmark-outline"
              onPress={() => router.push("/bookmarks")}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Bookmarks
            </Button>
          </View>
        </Surface>

        <Divider style={styles.divider} />

        {/* Recent Reading History */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Reading
          </Text>
          <List.Section>
            {readingHistory.map((item) => (
              <List.Item
                key={item.id}
                title={item.title}
                description={`${formatRelativeTime(item.timestamp)} • ${item.preview}`}
                left={(props) => (
                  <List.Icon {...props} icon="book-open-variant" />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push(`/ang/${item.angNumber}`)}
                style={styles.historyItem}
              />
            ))}
          </List.Section>
        </View>
      </ScrollView>

      {/* Go to Ang Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Go to Ang</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Ang Number (1-1430)"
              value={angNumber}
              onChangeText={setAngNumber}
              keyboardType="numeric"
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={handleGoToAng}
              disabled={
                !angNumber ||
                parseInt(angNumber) < 1 ||
                parseInt(angNumber) > 1430
              }
            >
              Go
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hukamnamaCard: {
    padding: 8,
    paddingTop: 16,
    margin: 16,
    marginBottom: 8,
  },
  cardLabel: {
    marginBottom: 4,
    fontWeight: "600",
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: "700",
  },
  preview: {
    lineHeight: 20,
  },
  loadingIndicator: {
    marginVertical: 24,
  },
  readButton: {
    marginRight: 8,
  },
  quickActions: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: "100%",
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  historyItem: {
    paddingHorizontal: 0,
  },
});
