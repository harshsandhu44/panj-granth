import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Appbar,
  useTheme,
  Chip,
  Divider,
  Snackbar,
  Portal,
  Button,
} from "react-native-paper";
import { useAng } from "@/hooks/useAng";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useBookmarks } from "@/hooks/useBookmarks";
import { GurbaniLine } from "@/components/GurbaniLine";
import { LoadingAng } from "@/components/LoadingAng";
import { ErrorView } from "@/components/ErrorView";
import { TranslationToggle } from "@/components/TranslationToggle";
import { BookmarkNoteDialog } from "@/components/BookmarkNoteDialog";

export default function AngScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const angNumber = parseInt(id || "1", 10);

  const { ang, loading, error, refetch } = useAng(angNumber);
  const { addToHistory } = useReadingHistory();
  const {
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    updateNote,
  } = useBookmarks();

  // Bookmark state
  const bookmarked = isBookmarked(angNumber);
  const existingBookmark = getBookmark(angNumber);

  // Dialog and Snackbar state
  const [noteDialogVisible, setNoteDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Track reading history when Ang is successfully loaded
  useEffect(() => {
    if (ang && !loading && !error) {
      addToHistory(ang).catch((err) => {
        console.error("Failed to save reading history:", err);
      });
    }
  }, [ang, loading, error, addToHistory]);

  // Bookmark handlers
  const handleBookmarkPress = () => {
    if (bookmarked) {
      // Already bookmarked: Show edit dialog
      setNoteDialogVisible(true);
    } else if (ang) {
      // Not bookmarked: Show dialog to add note
      setNoteDialogVisible(true);
    }
  };

  const handleNoteSave = async (note: string) => {
    try {
      if (bookmarked) {
        // Update existing bookmark note
        await updateNote(angNumber, note);
        setSnackbarMessage("Bookmark updated");
      } else if (ang) {
        // Add new bookmark with note
        await addBookmark(ang, note);
        setSnackbarMessage("Bookmark added");
      }
      setNoteDialogVisible(false);
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Failed to save bookmark:", error);
      setSnackbarMessage("Failed to save bookmark");
      setSnackbarVisible(true);
    }
  };

  const handleQuickRemove = async () => {
    try {
      await removeBookmark(angNumber);
      setSnackbarMessage("Bookmark removed");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  // Navigation handlers
  const handlePreviousAng = () => {
    if (angNumber > 1) {
      router.push(`/ang/${angNumber - 1}`);
    }
  };

  const handleNextAng = () => {
    if (angNumber < 1430) {
      router.push(`/ang/${angNumber + 1}`);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={`Ang ${angNumber}`} />
        </Appbar.Header>
        <LoadingAng />
      </View>
    );
  }

  if (error || !ang) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={`Ang ${angNumber}`} />
        </Appbar.Header>
        <ErrorView
          title={`Error loading Ang ${angNumber}`}
          message={error || "Unable to load this Ang"}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Ang ${angNumber}`} />
        <TranslationToggle />
        <Appbar.Action
          icon={bookmarked ? "bookmark" : "bookmark-outline"}
          onPress={handleBookmarkPress}
        />
        {bookmarked && (
          <Appbar.Action icon="bookmark-remove" onPress={handleQuickRemove} />
        )}
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Metadata */}
        {(ang.writer || ang.raag) && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metaContainer}
            >
              {ang.writer && <Chip icon="account">{ang.writer}</Chip>}
              {ang.raag && <Chip icon="music">{ang.raag}</Chip>}
              <Chip icon="counter">{ang.count} lines</Chip>
            </ScrollView>
            <Divider />
          </View>
        )}

        {/* Lines */}
        {ang.lines.map((line, index) => (
          <GurbaniLine key={line.id || index} line={line} />
        ))}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <Button
            mode="contained-tonal"
            icon="chevron-left"
            onPress={handlePreviousAng}
            disabled={angNumber === 1}
            style={styles.navButton}
            contentStyle={styles.navButtonContent}
          >
            Previous Ang
          </Button>
          <Button
            mode="contained-tonal"
            icon="chevron-right"
            contentStyle={[styles.navButtonContent, styles.navButtonContentRight]}
            onPress={handleNextAng}
            disabled={angNumber === 1430}
            style={styles.navButton}
          >
            Next Ang
          </Button>
        </View>
      </ScrollView>

      {/* Bookmark Note Dialog */}
      <BookmarkNoteDialog
        visible={noteDialogVisible}
        onDismiss={() => setNoteDialogVisible(false)}
        onSave={handleNoteSave}
        initialNote={existingBookmark?.note}
        angNumber={angNumber}
      />

      {/* Snackbar for confirmations */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  navigationContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  navButton: {
    flex: 1,
  },
  navButtonContent: {
    paddingVertical: 8,
  },
  navButtonContentRight: {
    flexDirection: "row-reverse",
  },
});
