import React from "react";
import { View, FlatList, StyleSheet, Text, useWindowDimensions, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "./CategoryCard";
import { getCategories } from "@/api/Category";

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();

  const { data: categories = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading && !isRefetching) return <Text style={styles.loading}>جاري التحميل...</Text>;
  if (error instanceof Error) return <Text style={styles.error}>خطأ: {error.message}</Text>;

  const numColumns = width > 1000 ? 4 : width > 700 ? 3 : 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>كل الكاتيغوري</Text>
      <FlatList
        data={categories}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => <CategoryCard id={item.id} name={item.name} image={item.image} />}
        numColumns={numColumns}
        key={`flatlist-${numColumns}`}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 16, marginBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#000"]} tintColor="#000" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", marginVertical: 24, textAlign: "center" },
  loading: { flex: 1, textAlign: "center", marginTop: 120, fontSize: 18, color: "#666" },
  error: { flex: 1, textAlign: "center", marginTop: 120, fontSize: 17, color: "red" },
});