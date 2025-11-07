/**
 * Bookmarks Screen
 * Display and manage bookmarked Angs with search, sort, and edit features
 */

import { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Text,
  Appbar,
  useTheme,
  List,
  TextInput,
  Menu,
  Divider,
  Button,
  Snackbar,
  Portal,
  IconButton,
} from "react-native-paper";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkService } from "@/services/bookmarks";
import { BookmarkNoteDialog } from "@/components/BookmarkNoteDialog";
import { formatRelativeTime } from "@/services/mock-data";
import { Bookmark, BookmarkSortOption } from "@/types/index";

export default function BookmarksScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    bookmarks,
    loading,
    removeBookmark,
    updateNote,
    refresh,
    bookmarkCount,
  } = useBookmarks();

  // Search state
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort state
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<BookmarkSortOption>("date");

  // Edit note dialog state
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deletedBookmark, setDeletedBookmark] = useState<Bookmark | null>(null);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Filter and sort bookmarks
  const filteredBookmarks = searchQuery
    ? BookmarkService.searchBookmarks(searchQuery, bookmarks)
    : bookmarks;

  const sortedBookmarks = BookmarkService.sortBookmarks(
    filteredBookmarks,
    sortBy
  );

  // Handlers
  const handleBookmarkPress = (bookmark: Bookmark) => {
    router.push(`/ang/${bookmark.angNumber}`);
  };

  const handleEditNote = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditDialogVisible(true);
  };

  const handleNoteSave = async (note: string) => {
    if (editingBookmark) {
      try {
        await updateNote(editingBookmark.angNumber, note);
        setSnackbarMessage("Note updated");
        setSnackbarVisible(true);
        setEditDialogVisible(false);
        setEditingBookmark(null);
      } catch (error) {
        console.error("Failed to update note:", error);
      }
    }
  };

  const handleDelete = async (bookmark: Bookmark) => {
    try {
      setDeletedBookmark(bookmark);
      await removeBookmark(bookmark.angNumber);
      setSnackbarMessage("Bookmark deleted");
      setSnackbarVisible(true);

      // Auto-clear deleted bookmark after 5 seconds
      setTimeout(() => setDeletedBookmark(null), 5000);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleUndo = async () => {
    if (deletedBookmark) {
      try {
        await BookmarkService.restoreBookmark(deletedBookmark);
        await refresh();
        setDeletedBookmark(null);
        setSnackbarMessage("Bookmark restored");
      } catch (error) {
        console.error("Failed to restore bookmark:", error);
      }
    }
  };

  const handleSortSelect = (option: BookmarkSortOption) => {
    setSortBy(option);
    setSortMenuVisible(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "date":
        return "Date";
      case "angNumber":
        return "Ang Number";
      case "raag":
        return "Raag";
      case "writer":
        return "Writer";
      default:
        return "Date";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={`Bookmarks${bookmarkCount > 0 ? ` (${bookmarkCount})` : ""}`}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              onPress={() => setSortMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => handleSortSelect("date")}
            title="Date"
            leadingIcon={sortBy === "date" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleSortSelect("angNumber")}
            title="Ang Number"
            leadingIcon={sortBy === "angNumber" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleSortSelect("raag")}
            title="Raag"
            leadingIcon={sortBy === "raag" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleSortSelect("writer")}
            title="Writer"
            leadingIcon={sortBy === "writer" ? "check" : undefined}
          />
        </Menu>
      </Appbar.Header>

      {/* Search Bar */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchQuery ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setSearchQuery("")}
                />
              ) : undefined
            }
            style={styles.searchInput}
          />
        </View>
      )}

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {sortedBookmarks.length === 0 ? (
          <View style={styles.emptyState}>
            <List.Icon icon="bookmark-outline" />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              {searchQuery ? "No Results Found" : "No Bookmarks Yet"}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
            >
              {searchQuery
                ? "Try a different search term"
                : "Start reading and bookmark your favorite Angs to see them here"}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              variant="bodySmall"
              style={[styles.sortInfo, { color: theme.colors.onSurfaceVariant }]}
            >
              Sorted by: {getSortLabel()}
            </Text>
            <List.Section>
              {sortedBookmarks.map((bookmark) => (
                <View key={bookmark.id}>
                  <List.Item
                    title={bookmark.title}
                    description={
                      <>
                        {formatRelativeTime(bookmark.timestamp)}
                        {bookmark.preview && ` • ${bookmark.preview}`}
                        {bookmark.note && (
                          <>
                            {"\n"}
                            <Text style={{ fontStyle: "italic" }}>
                              Note: {bookmark.note}
                            </Text>
                          </>
                        )}
                      </>
                    }
                    left={(props) => (
                      <List.Icon {...props} icon="bookmark" />
                    )}
                    right={(props) => (
                      <View style={styles.actionsContainer}>
                        <IconButton
                          {...props}
                          icon="note-edit-outline"
                          size={20}
                          onPress={() => handleEditNote(bookmark)}
                        />
                        <IconButton
                          {...props}
                          icon="delete-outline"
                          size={20}
                          onPress={() => handleDelete(bookmark)}
                        />
                      </View>
                    )}
                    onPress={() => handleBookmarkPress(bookmark)}
                    style={styles.bookmarkItem}
                  />
                  <Divider />
                </View>
              ))}
            </List.Section>
          </View>
        )}
      </ScrollView>

      {/* Edit Note Dialog */}
      {editingBookmark && (
        <BookmarkNoteDialog
          visible={editDialogVisible}
          onDismiss={() => {
            setEditDialogVisible(false);
            setEditingBookmark(null);
          }}
          onSave={handleNoteSave}
          initialNote={editingBookmark.note}
          angNumber={editingBookmark.angNumber}
        />
      )}

      {/* Snackbar */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={deletedBookmark ? 5000 : 2000}
          action={
            deletedBookmark
              ? {
                  label: "Undo",
                  onPress: handleUndo,
                }
              : undefined
          }
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    marginBottom: 0,
  },
  sortInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
  },
  bookmarkItem: {
    paddingVertical: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
