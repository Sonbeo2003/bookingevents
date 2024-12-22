import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import url from "../../../ipconfig";

const PetScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);

  // Sử dụng useFocusEffect đúng cách để gọi fetchPets khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchPets = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          const user = userData ? JSON.parse(userData) : null;

          if (user && user.idnguoidung) {
            const response = await fetch(
              `${url}/API_Events/getthucungbynguoidung.php?idnguoidung=${user.idnguoidung}`
            );
            const petsData = await response.json();
            setPets(petsData);
            setFilteredPets(petsData);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách thú cưng:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPets();
    }, [])
  );

  // Tìm kiếm thú cưng
  useEffect(() => {
    if (searchTerm) {
      const filtered = pets.filter((pet) =>
        pet.tenthucung.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPets(filtered);
    } else {
      setFilteredPets(pets);
    }
  }, [searchTerm, pets]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEdit = (petId, petData) => {
    navigation.navigate("EditPet", { petId, petData });
  };

  const handleDelete = (petId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa thú cưng này không?",
      [
        {
          text: "Hủy",
          onPress: () => navigation.goBack,
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const response = await fetch(`${url}/api/xoathucung.php`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ idthucung: petId }),
              });

              const result = await response.json();

              if (result.success) {
                // Xóa thú cưng
                const updatedPets = pets.filter(
                  (pet) => pet.idthucung !== petId
                );
                setPets(updatedPets);
                setFilteredPets(updatedPets);
                alert("Xóa thú cưng thành công!");
              } else {
                alert("Xóa thú cưng thất bại, vui lòng thử lại.");
              }
            } catch (error) {
              console.error("Lỗi khi xóa thú cưng:", error);
              alert("Đã xảy ra lỗi, vui lòng thử lại.");
            }
          },
          style: "destructive", // Kiểu nút "Xóa"
        },
      ]
      // { cancelable: true }
    );
  };

  const renderPetItem = ({ item }) => (
    <View style={styles.petItem}>
      <TouchableOpacity
        style={styles.petInfo}
        onPress={() =>
          navigation.navigate("PetDetail", { petId: item.idthucung })
        }
      >
        <View style={styles.petRow}>
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/pet-logo-design-paw-vector-animal-shop-business_53876-136741.jpg",
            }}
            style={styles.petImage}
          />
          <View style={styles.petDetailsContainer}>
            <Text style={styles.petName}>{item.tenthucung}</Text>
            <Text style={styles.petDetails}>
              Loại: {item.loaithucung} | Giống: {item.giongloai}
            </Text>
            <Text style={styles.petDetails}>Tuổi: {item.tuoi}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => handleEdit(item.idthucung, item)}>
          <Icon name="edit" size={20} color="#FF9900" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.idthucung)}>
          <Icon name="trash" size={20} color="#FF0000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thú cưng..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPet")}
      >
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Thêm thú cưng</Text>
      </TouchableOpacity>

      {filteredPets.length > 0 ? (
        <FlatList
          data={filteredPets}
          renderItem={renderPetItem}
          keyExtractor={(item) => item.idthucung.toString()}
        />
      ) : (
        <Text style={styles.noPetsText}>Chưa có thú cưng nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
   
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9900",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  petItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  petRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  petDetailsContainer: {
    flexShrink: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  petDetails: {
    fontSize: 14,
    color: "#666",
    flexWrap: "wrap",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 5,
  },
  noPetsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default PetScreen;
