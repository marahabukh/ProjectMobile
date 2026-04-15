import { getProductsByCategory } from "@/api/Category";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import ProductCard from "../../components/ProductCard";

interface Product {
  id: string; 
  name: string;
  title: string; 
  price: number;
  image: string;
  rating?: number;
}

type SortOption = "price_asc" | "price_desc" | "name";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "السعر ↑", value: "price_asc" },
  { label: "السعر ↓", value: "price_desc" },
];

export default function CategoryProductsScreen() {
  const { id, name } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("الفئة");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price_asc");

  const numColumns =
    width >= 1200 ? 5 : width >= 900 ? 4 : width >= 600 ? 3 : 2;

  const fetchProducts = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      if (id) {
        const data = await getProductsByCategory(id as string);
        setProducts(data);
      }
      if (name) setCategoryName(name as string);
    } catch (error) {
      console.log("Error fetching category products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id, name]);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, search, sortBy]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <FlatList<Product>
      key={`flatlist-${numColumns}`}
      data={filteredAndSorted}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View
          style={[
            styles.cardWrapper,
            { width: `${100 / numColumns}%`, paddingHorizontal: 4 },
          ]}
        >
          <ProductCard product={item} />
        </View>
      )}
      contentContainerStyle={styles.container}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchProducts(true)}
          colors={["#000"]}
          tintColor="#000"
        />
      }
      ListHeaderComponent={
        <>
          <BackButton />
          <Text style={styles.header}>منتجات {categoryName}</Text>

          {/* Search */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن منتج"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              textAlign="right"
              textAlignVertical="center"
            />
          </View>

          {/* Sort */}
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>ترتيب:</Text>
            <View style={styles.sortButtons}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.sortButton,
                    sortBy === opt.value && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortBy(opt.value)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === opt.value && styles.sortButtonTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Count */}
          <Text style={styles.countText}>
            {filteredAndSorted.length} منتج
          </Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            {search ? "لا توجد نتائج للبحث" : "لا توجد منتجات في هذه الفئة"}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row-reverse",
  },
  cardWrapper: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  searchContainer: {
    marginHorizontal: 4,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
    textAlign: "right",
  },
  sortContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 10,
    gap: 10,
  },
  sortLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  sortButtons: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  sortButtonActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  sortButtonText: {
    fontSize: 13,
    color: "#555",
  },
  sortButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  countText: {
    fontSize: 13,
    color: "#999",
    textAlign: "right",
    marginHorizontal: 8,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
});