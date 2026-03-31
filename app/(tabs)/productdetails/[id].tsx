import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProductById } from "@/api/Product"; // ← استدعاء API

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const isLargeScreen = width > 900;

  useEffect(() => {
    if (id) fetchProductFromAPI();
  }, [id]);

  const fetchProductFromAPI = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id as string); // ← استدعاء Axios API
      setProduct(data);
      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9f1239" />
        <Text style={styles.loadingText}>جاري تحميل المنتج...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>لم يتم العثور على المنتج</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mainContent,
            isLargeScreen && styles.mainContentLarge,
          ]}
        >
          {/* IMAGE */}
          <View
            style={[
              styles.imageContainer,
              isLargeScreen && styles.imageContainerLarge,
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Image
              source={{ uri: product.image || product.imageURL }}
              style={styles.mainImage}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Image
                source={{ uri: product.image || product.imageURL }}
                style={styles.thumbnail}
              />
            </ScrollView>
          </View>

          {/* DETAILS */}
          <View
            style={[
              styles.detailsContainer,
              isLargeScreen && styles.detailsContainerLarge,
            ]}
          >
            <Text style={styles.price}>₪{product.price}</Text>
            <Text style={styles.title}>{product.title || product.name}</Text>

            {/* SIZES */}
            {product.sizes?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>اختر المقاس</Text>
                <View style={styles.sizesContainer}>
                  {product.sizes.map((size: string) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.selectedSize,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          selectedSize === size && styles.selectedSizeText,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* QUANTITY */}
            <Text style={styles.sectionTitle}>الكمية</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* BUTTON */}
            <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.buttonText}>أضف إلى السلة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

// ----------------- STYLES -----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fafafa" },
  mainContent: { flexDirection: "column" },
  mainContentLarge: {
    flexDirection: "row-reverse",
    width: "100%",
    paddingHorizontal: 60,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },
  imageContainer: { width: "100%" },
  imageContainerLarge: { flex: 1, maxWidth: 500 },
  mainImage: { width: "100%", height: 380, borderRadius: 20, backgroundColor: "#eee" },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginTop: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#9f1239",
  },
  detailsContainer: { padding: 20 },
  detailsContainerLarge: { flex: 1, justifyContent: "center" },
  price: { fontSize: 32, fontWeight: "800", color: "#9f1239", textAlign: "right" },
  title: { fontSize: 22, fontWeight: "600", color: "#333", textAlign: "right", marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 20, textAlign: "right" },
  sizesContainer: { flexDirection: "row", justifyContent: "flex-end", flexWrap: "wrap", gap: 10, marginTop: 10 },
  sizeButton: { width: 55, height: 55, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", alignItems: "center", justifyContent: "center" },
  selectedSize: { borderColor: "#9f1239", backgroundColor: "#fff1f2" },
  sizeText: { fontSize: 16, fontWeight: "600" },
  selectedSizeText: { color: "#9f1239" },
  quantityContainer: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 15, marginTop: 10 },
  qtyButton: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 22, fontWeight: "600" },
  quantity: { fontSize: 18, fontWeight: "600" },
  addToCartButton: { backgroundColor: "#9f1239", paddingVertical: 18, borderRadius: 14, alignItems: "center", marginTop: 25, elevation: 5 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  errorText: { color: "red", fontSize: 16 },
});