import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getProductsByCategory } from "@/api/Category";

import ProductCard from "../ProductCard";

export default function CategoryProductsScreen() {
  const { id, name } = useLocalSearchParams(); // name = اسم الفئة (لو مررته من الصفحة السابقة)

  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState<string>("الفئة");

  useEffect(() => {
    if (id) {
      getProductsByCategory(id as string).then((data) => {
        console.log("Products for category:", data);
        setProducts(data);
      });
    }

    // لو اسم الفئة جاي في الـ params
    if (name) {
      setCategoryName(name as string);
    }
  }, [id, name]);

  if (!products.length) {
    return <Text style={styles.emptyText}>لا توجد منتجات في هذه الفئة</Text>;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}                    // ← عرض في عمودين (جمب بعض)
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}   // مسافة بين الأعمدة
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={styles.header}>
          منتجات {categoryName}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",   // مسافة متساوية بين الكروت
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 18,
    color: "#666",
  },
});