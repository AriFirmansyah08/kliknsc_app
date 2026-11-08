import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export type Option = { value: string; label: string };

const RED = "#E8311A";

export function PickerSheet({
  visible,
  options,
  loading,
  selected,
  onClose,
  onPick,
}: {
  visible: boolean;
  options: Option[];
  loading: boolean;
  selected: string;
  onClose: () => void;
  onPick: (o: Option) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [options, q],
  );

  const close = () => {
    setQ("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <TextInput
            style={styles.search}
            placeholder="Cari..."
            placeholderTextColor="#999"
            value={q}
            onChangeText={setQ}
            autoCorrect={false}
          />

          {loading ? (
            <ActivityIndicator color={RED} style={{ margin: 24 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(o) => o.value}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.empty}>Tidak ada data</Text>
              }
              renderItem={({ item }) => {
                const active = item.label === selected;
                return (
                  <Pressable
                    style={styles.option}
                    onPress={() => {
                      setQ("");
                      onPick(item);
                    }}
                  >
                    <Text style={[styles.optionText, active && styles.active]}>
                      {item.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark" size={20} color={RED} />
                    )}
                  </Pressable>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.001)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D0D0",
    marginVertical: 10,
  },
  search: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: { fontSize: 16, color: "#111", flex: 1 },
  active: { color: RED, fontWeight: "800" },
  empty: { textAlign: "center", color: "#888", padding: 24 },
});
