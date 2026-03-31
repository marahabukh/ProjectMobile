import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Picker } from "react-native";
import { createProduct } from "../../../api/Product";
import { getCategories } from "../../../api/Category";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id); // نحدد أول كاتيغوري بشكل افتراضي
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    if (!categoryId) return Alert.alert("Error", "Please select a category");

    try {
      await createProduct({
        title,
        price: Number(price),
        image,
        categoryId, // ← أهم شيء
      });
      Alert.alert("تم إضافة المنتج ✅");
      setTitle("");
      setPrice("");
      setImage("");
      setCategoryId(categories[0]?.id || null);
    } catch (error: any) {
      console.error("Error creating product:", error);
      Alert.alert("حدث خطأ: " + (error.message || "Unknown error"));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Product Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />

      {/* Dropdown للكاتيغوري */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoryId} onValueChange={(itemValue) => setCategoryId(itemValue)}>
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { backgroundColor: "#eee", padding: 12, borderRadius: 8, marginBottom: 15 },
  pickerContainer: { backgroundColor: "#eee", borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "black", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" },
});