/**
 * Search Screen
 * Full-page search interface for Guru Granth Sahib
 */

import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  Chip,
  Menu,
  Divider,
  Appbar,
  Banner,
  Icon,
} from "react-native-paper";
import { useSearch } from "@/hooks/useSearch";
import { SearchResult } from "@/components/SearchResult";
import { SearchFilters } from "@/types/api";
import { SEARCH_TYPES, WRITERS, RAAGS } from "@/constants/data";

export default function SearchScreen() {
  const router = useRouter();
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

  // Handle search when query or filters change
  useEffect(() => {
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
  }, [query, searchType, selectedWriter, selectedRaag, angFrom]);

  // Get display labels
  const getSearchTypeLabel = () => {
    const type = SEARCH_TYPES.find((t) => t.value === searchType);
    return type?.label || "Full Word (English)";
  };

  const getWriterLabel = () => {
    if (!selectedWriter) return "All Writers";
    const writer = WRITERS.find((w) => w.id === selectedWriter);
    return writer?.label || "All Writers";
  };

  const getRaagLabel = () => {
    if (!selectedRaag) return "All Raags";
    const raag = RAAGS.find((r) => r.id === selectedRaag);
    return raag?.label || "All Raags";
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Search" />
        {query && (
          <Appbar.Action
            icon="close"
            onPress={() => {
              setQuery("");
              clear();
            }}
          />
        )}
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          {/* API Unavailable Banner */}
          <Banner
            visible={true}
            icon="alert-circle-outline"
            style={[styles.banner, { backgroundColor: theme.colors.errorContainer }]}
          >
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onErrorContainer }}
            >
              Search is temporarily unavailable due to API limitations. The search
              feature will be enabled once the Gurbani Now API is restored.
            </Text>
          </Banner>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              mode="outlined"
              label="Search Guru Granth Sahib"
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
                      onPress={() => setRaagMenuVisible(true)}
                      style={styles.filterChip}
                      closeIcon={selectedRaag ? "close" : undefined}
                      onClose={
                        selectedRaag ? () => setSelectedRaag(undefined) : undefined
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
                Search functionality is currently unavailable
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                The Gurbani Now API search endpoint is not responding. Please check
                back later.
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
        </View>
      </ScrollView>
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
  banner: {
    marginBottom: 16,
    borderRadius: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
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
    marginVertical: 8,
  },
  advancedContainer: {
    marginBottom: 8,
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
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
    paddingHorizontal: 16,
  },
  resultsHeader: {
    marginVertical: 12,
  },
  loadMoreContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
});
