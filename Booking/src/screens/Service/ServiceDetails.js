import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ServiceDetails = ({ route, navigation }) => {
  const { tenDichVu, hinhAnhDichVu, moTaDichVu, giaDichVu, thoiGianThucHien } =
    route.params;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatPrice = (Gia) => {
    return Gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Phần hình ảnh dịch vụ */}
        <View style={styles.imageContainer}>
          <Image style={styles.serviceImage} source={{ uri: hinhAnhDichVu }} />
        </View>

        {/* Phần tiêu đề và mô tả dịch vụ */}
        <View style={styles.contentContainer}>
          <Text style={styles.serviceTitle}>{tenDichVu}</Text>
          <Text style={styles.serviceDescription}>
            {showFullDescription || moTaDichVu.length <= 200
              ? moTaDichVu
              : moTaDichVu.slice(0, 200) + "..."}
          </Text>
          {moTaDichVu.length > 200 && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreContainer}
            >
              <View style={styles.readMoreContent}>
                <Text style={styles.readMoreButton}>
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </Text>
                <Icon
                  name={showFullDescription ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#f9b233"
                  style={styles.readMoreIcon}
                />
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.servicePrice}>
            Giá: {formatPrice(giaDichVu)} VND
          </Text>
          <Text style={styles.serviceTime}>
            Thời gian thực hiện: {thoiGianThucHien}
          </Text>
        </View>
      </ScrollView>

      {/* Nút Đặt lịch */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => navigation.navigate("Booking")}
        >
          <Text style={styles.bookingButtonText}>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 80, // Tạo khoảng trống để tránh tràn vào nút cố định
  },
  imageContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  readMoreContainer: {
    marginTop: 5,
  },
  readMoreContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreButton: {
    color: "#f9b233",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 5,
  },
  readMoreIcon: {
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f9b233",
    marginVertical: 10,
  },
  serviceTime: {
    fontSize: 16,
    color: "#555",
  },
  bookingContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
  },
  bookingButton: {
    backgroundColor: "#f9b233",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ServiceDetails;
