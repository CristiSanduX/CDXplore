import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { COUNTRIES, type Country } from "../../src/data/countries";
import { loadVisited, saveVisited } from "../../src/visited/visitedStore";

type Row = Country;

export default function CountriesScreen() {
  const [q, setQ] = useState("");
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await loadVisited();
        if (alive) setVisited(v);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s) ||
        c.continent.toLowerCase().includes(s)
    );
  }, [q]);

  const visitedCount = visited.size;

  const toggle = (code: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);

      // fire & forget save
      saveVisited(next).catch(console.log);
      return next;
    });
  };

  const renderItem = ({ item }: { item: Row }) => {
    const isOn = visited.has(item.code);
    return (
      <Pressable
        onPress={() => toggle(item.code)}
        style={{
          padding: 14,
          borderRadius: 16,
          borderWidth: 1,
          marginBottom: 10,
          backgroundColor: isOn ? "rgba(34,197,94,0.12)" : "transparent",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>
              {item.name}{" "}
              <Text style={{ fontSize: 13, fontWeight: "700", opacity: 0.6 }}>
                {item.code}
              </Text>
            </Text>
            <Text style={{ marginTop: 4, opacity: 0.65 }}>
              {item.continent}
            </Text>
          </View>

          <View
            style={{
              width: 44,
              height: 28,
              borderRadius: 14,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              opacity: isOn ? 1 : 0.45,
            }}
          >
            <Text style={{ fontWeight: "900" }}>{isOn ? "✓" : ""}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "900", marginBottom: 6 }}>
        Countries
      </Text>

      <Text style={{ opacity: 0.7, marginBottom: 14 }}>
        Visited: {visitedCount}
      </Text>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search country / code / continent"
        placeholderTextColor="rgba(0,0,0,0.35)"
        autoCapitalize="none"
        style={{
          height: 48,
          borderRadius: 14,
          borderWidth: 1,
          paddingHorizontal: 14,
          marginBottom: 14,
        }}
      />

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, opacity: 0.7 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(x) => x.code}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
