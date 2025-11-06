/**
 * SearchModal Component
 * Full-featured search dialog with filters and results
 */

import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Portal,
  Dialog,
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  Chip,
  Menu,
  Divider,
  IconButton,
} from "react-native-paper";
import { useSearch } from "@/hooks/useSearch";
import { SearchResult } from "@/components/SearchResult";
import { SearchFilters } from "@/types/api";
import { SEARCH_TYPES, WRITERS, RAAGS } from "@/constants/data";

interface SearchModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function SearchModal({ visible, onDismiss }: SearchModalProps) {
  const theme = useTheme();
  const {
    results,
    totalCount,
    loading,
    error,
    hasMore,
    search,
    loadMore,
    clear,
  } = useSearch();

  // Search state
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter state
  const [searchType, setSearchType] = useState(3); // Default: Full Word (English)
  const [selectedWriter, setSelectedWriter] = useState<number | undefined>();
  const [selectedRaag, setSelectedRaag] = useState<number | undefined>();
  const [angFrom, setAngFrom] = useState("");
  const [angTo, setAngTo] = useState("");

  // Menu visibility
  const [searchTypeMenuVisible, setSearchTypeMenuVisible] = useState(false);
  const [writerMenuVisible, setWriterMenuVisible] = useState(false);
  const [raagMenuVisible, setRaagMenuVisible] = useState(false);

  // Handle search when query changes
  useEffect(() => {
    if (!visible) return;

    const filters: SearchFilters = {
      searchType,
      writer: selectedWriter,
      raag: selectedRaag,
    };

    // Add ang range if specified
    if (angFrom && !isNaN(parseInt(angFrom))) {
      const from = parseInt(angFrom);
      if (from >= 1 && from <= 1430) {
        filters.ang = from;
      }
    }

    search(query, filters);
  }, [query, searchType, selectedWriter, selectedRaag, angFrom, visible]);

  // Clear on dismiss
  const handleDismiss = () => {
    clear();
    setQuery("");
    setShowAdvanced(false);
    setSelectedWriter(undefined);
    setSelectedRaag(undefined);
    setAngFrom("");
    setAngTo("");
    onDismiss();
  };

  // Get display label for search type
  const getSearchTypeLabel = () => {
    const type = SEARCH_TYPES.find((t) => t.value === searchType);
    return type?.label || "Full Word (English)";
  };

  // Get display label for writer
  const getWriterLabel = () => {
    if (!selectedWriter) return "All Writers";
    const writer = WRITERS.find((w) => w.id === selectedWriter);
    return writer?.label || "All Writers";
  };

  // Get display label for raag
  const getRaagLabel = () => {
    if (!selectedRaag) return "All Raags";
    const raag = RAAGS.find((r) => r.id === selectedRaag);
    return raag?.label || "All Raags";
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleDismiss}
        style={styles.dialog}
      >
        <Dialog.Title>Search Guru Granth Sahib</Dialog.Title>

        <Dialog.ScrollArea style={styles.scrollArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView>
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <TextInput
                  mode="outlined"
                  label="Search..."
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Enter Gurmukhi or English text"
                  autoFocus
                  right={
                    query ? (
                      <TextInput.Icon icon="close" onPress={() => setQuery("")} />
                    ) : undefined
                  }
                />
              </View>

              {/* Search Type Selector */}
              <View style={styles.filterRow}>
                <Text variant="labelMedium" style={styles.filterLabel}>
                  Search Type:
                </Text>
                <Menu
                  visible={searchTypeMenuVisible}
                  onDismiss={() => setSearchTypeMenuVisible(false)}
                  anchor={
                    <Chip
                      mode="outlined"
                      onPress={() => setSearchTypeMenuVisible(true)}
                      style={styles.filterChip}
                    >
                      {getSearchTypeLabel()}
                    </Chip>
                  }
                >
                  {SEARCH_TYPES.map((type) => (
                    <Menu.Item
                      key={type.value}
                      onPress={() => {
                        setSearchType(type.value);
                        setSearchTypeMenuVisible(false);
                      }}
                      title={type.label}
                      titleStyle={{ fontSize: 14 }}
                    />
                  ))}
                </Menu>
              </View>

              {/* Advanced Filters Toggle */}
              <Button
                mode="text"
                icon={showAdvanced ? "chevron-up" : "chevron-down"}
                onPress={() => setShowAdvanced(!showAdvanced)}
                style={styles.advancedButton}
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Filters
              </Button>

              {showAdvanced && (
                <View style={styles.advancedContainer}>
                  <Divider style={styles.divider} />

                  {/* Writer Filter */}
                  <View style={styles.filterRow}>
                    <Text variant="labelMedium" style={styles.filterLabel}>
                      Writer:
                    </Text>
                    <Menu
                      visible={writerMenuVisible}
                      onDismiss={() => setWriterMenuVisible(false)}
                      anchor={
                        <Chip
                          mode="outlined"
                          onPress={() => setWriterMenuVisible(true)}
                          style={styles.filterChip}
                          closeIcon={selectedWriter ? "close" : undefined}
                          onClose={
                            selectedWriter
                              ? () => setSelectedWriter(undefined)
                              : undefined
                          }
                        >
                          {getWriterLabel()}
                        </Chip>
                      }
                    >
                      <ScrollView style={{ maxHeight: 300 }}>
                        <Menu.Item
                          onPress={() => {
                            setSelectedWriter(undefined);
                            setWriterMenuVisible(false);
                          }}
                          title="All Writers"
                        />
                        <Divider />
                        {WRITERS.map((writer) => (
                          <Menu.Item
                            key={writer.id}
                            onPress={() => {
                              setSelectedWriter(writer.id);
                              setWriterMenuVisible(false);
                            }}
                            title={writer.label}
                            titleStyle={{ fontSize: 14 }}
                          />
                        ))}
                      </ScrollView>
                    </Menu>
                  </View>

                  {/* Raag Filter */}
                  <View style={styles.filterRow}>
                    <Text variant="labelMedium" style={styles.filterLabel}>
                      Raag:
                    </Text>
                    <Menu
                      visible={raagMenuVisible}
                      onDismiss={() => setRaagMenuVisible(false)}
                      anchor={
                        <Chip
                          mode="outlined"
                          onPress={() => setRaagMenuVisible(false)}
                          style={styles.filterChip}
                          closeIcon={selectedRaag ? "close" : undefined}
                          onClose={
                            selectedRaag
                              ? () => setSelectedRaag(undefined)
                              : undefined
                          }
                        >
                          {getRaagLabel()}
                        </Chip>
                      }
                    >
                      <ScrollView style={{ maxHeight: 300 }}>
                        <Menu.Item
                          onPress={() => {
                            setSelectedRaag(undefined);
                            setRaagMenuVisible(false);
                          }}
                          title="All Raags"
                        />
                        <Divider />
                        {RAAGS.map((raag) => (
                          <Menu.Item
                            key={raag.id}
                            onPress={() => {
                              setSelectedRaag(raag.id);
                              setRaagMenuVisible(false);
                            }}
                            title={raag.label}
                            titleStyle={{ fontSize: 14 }}
                          />
                        ))}
                      </ScrollView>
                    </Menu>
                  </View>

                  {/* Ang Range */}
                  <View style={styles.filterRow}>
                    <Text variant="labelMedium" style={styles.filterLabel}>
                      Ang Range:
                    </Text>
                    <View style={styles.angRangeContainer}>
                      <TextInput
                        mode="outlined"
                        label="From"
                        value={angFrom}
                        onChangeText={setAngFrom}
                        keyboardType="numeric"
                        style={styles.angInput}
                        dense
                      />
                      <Text style={styles.angSeparator}>-</Text>
                      <TextInput
                        mode="outlined"
                        label="To"
                        value={angTo}
                        onChangeText={setAngTo}
                        keyboardType="numeric"
                        style={styles.angInput}
                        dense
                      />
                    </View>
                  </View>
                </View>
              )}

              <Divider style={styles.divider} />

              {/* Results */}
              {loading && results.length === 0 && (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" />
                  <Text variant="bodyMedium" style={styles.loadingText}>
                    Searching...
                  </Text>
                </View>
              )}

              {error && (
                <View style={styles.centerContainer}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                    {error}
                  </Text>
                </View>
              )}

              {!loading && !error && query && results.length === 0 && (
                <View style={styles.centerContainer}>
                  <Text variant="bodyLarge" style={styles.emptyTitle}>
                    No Results Found
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.emptyText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Try a different search term or adjust your filters
                  </Text>
                </View>
              )}

              {!query && !loading && (
                <View style={styles.centerContainer}>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Enter a search query to begin
                  </Text>
                </View>
              )}

              {results.length > 0 && (
                <>
                  <View style={styles.resultsHeader}>
                    <Text variant="titleSmall">
                      {totalCount} result{totalCount !== 1 ? "s" : ""} found
                    </Text>
                  </View>

                  {results.map((result, index) => (
                    <SearchResult
                      key={`${result.matchedLine.id}-${index}`}
                      result={result}
                      onPress={handleDismiss}
                    />
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <View style={styles.loadMoreContainer}>
                      <Button
                        mode="outlined"
                        onPress={loadMore}
                        loading={loading}
                        disabled={loading}
                      >
                        Load More
                      </Button>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button onPress={handleDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: "90%",
  },
  scrollArea: {
    maxHeight: 600,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexWrap: "wrap",
  },
  filterLabel: {
    marginRight: 8,
    minWidth: 80,
  },
  filterChip: {
    flex: 1,
  },
  advancedButton: {
    marginHorizontal: 24,
    marginVertical: 8,
  },
  advancedContainer: {
    paddingBottom: 8,
  },
  angRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  angInput: {
    flex: 1,
  },
  angSeparator: {
    marginHorizontal: 8,
  },
  divider: {
    marginVertical: 12,
  },
  centerContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loadMoreContainer: {
    padding: 24,
    alignItems: "center",
  },
});
