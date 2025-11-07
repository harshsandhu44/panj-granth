/**
 * BookmarkNoteDialog Component
 * Dialog for adding/editing bookmark notes
 */

import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Dialog,
  Portal,
  TextInput,
  Button,
  Text,
  useTheme,
} from "react-native-paper";

interface BookmarkNoteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (note: string) => void;
  initialNote?: string;
  angNumber: number;
}

const MAX_NOTE_LENGTH = 500;

export function BookmarkNoteDialog({
  visible,
  onDismiss,
  onSave,
  initialNote = "",
  angNumber,
}: BookmarkNoteDialogProps) {
  const theme = useTheme();
  const [note, setNote] = useState(initialNote);

  // Update note when initialNote changes (editing existing bookmark)
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  const handleSave = () => {
    onSave(note.trim());
    setNote(""); // Reset for next use
  };

  const handleDismiss = () => {
    setNote(initialNote); // Reset to initial value
    onDismiss();
  };

  const remainingChars = MAX_NOTE_LENGTH - note.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>
          {initialNote ? "Edit" : "Add"} Bookmark Note
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Ang {angNumber}
          </Text>
          <TextInput
            mode="outlined"
            label="Note (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            placeholder="Add a personal note or annotation..."
            style={styles.input}
            error={isOverLimit}
          />
          <Text
            variant="bodySmall"
            style={[
              styles.charCounter,
              {
                color: isOverLimit
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {remainingChars} characters remaining
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>Cancel</Button>
          <Button onPress={handleSave} disabled={isOverLimit}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  charCounter: {
    textAlign: "right",
  },
});
