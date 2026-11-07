import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import AgentHome from "../../../components/agent/AgentHome";
import { AgentStatusResponse, getAgentStatus } from "../../../services/agent";

export default function Home() {
  const [data, setData] = useState<AgentStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await getAgentStatus());
    } catch (e: any) {
      setError(e.message ?? "Gagal memuat data");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!data && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#E8311A" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={load}>
          <Text style={styles.retry}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor="#E8311A"
        />
      }
    >
      <AgentHome data={data} onRefresh={load} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#F2F2F2",
  },
  errorText: { textAlign: "center", color: "#111" },
  retry: { color: "#E8311A", fontWeight: "800", marginTop: 8 },
});
