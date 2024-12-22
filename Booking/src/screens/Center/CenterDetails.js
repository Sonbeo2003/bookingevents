import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import MapView, { Marker } from "react-native-maps"; // Nhập MapView và Marker
import url from "../../../ipconfig";

const CenterDetails = ({ route, navigation }) => {
  const { center } = route.params;
  const [services, setServices] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    console.log("Thông tin trung tâm:", center);
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${url}/API_Events/getdichvu_trungtam.php?idtrungtam=${center.idtrungtam}`
        );
        console.log(response.data);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [center.idtrungtam]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image style={styles.centerImage} source={{ uri: center.hinhanh }} />
        <Text style={styles.title}>{center.tentrungtam}</Text>
        <Text style={styles.description}>
          {showFullDescription || center.mota.length <= 200
            ? center.mota
            : center.mota.slice(0, 200) + "..."}
          {/* {center.mota} */}
        </Text>
        {center.mota.length > 200 && (
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
                color="#3399FF"
                style={styles.readMoreIcon}
              />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.contactContainer}>
          <View style={styles.contactItem}>
            <Icon name="map-marker" size={20} color="#f9b233" />
            <Text style={styles.text}>{center.diachi}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" size={20} color="#f9b233" />
            <Text style={styles.text}>{center.sodienthoai}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="envelope" size={20} color="#f9b233" />
            <Text style={styles.text}>{center.email}</Text>
          </View>
        </View>

        {/* Hiển thị bản đồ */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(center.Y_location), // Sử dụng vĩ độ
            longitude: parseFloat(center.X_location), // Sử dụng kinh độ
            latitudeDelta: 0.01, // Tùy chỉnh khoảng cách zoom
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(center.Y_location),
              longitude: parseFloat(center.X_location),
            }}
            title={center.tentrungtam}
            description={center.mota}
          />
        </MapView>

        {/* Danh sách dịch vụ theo chiều ngang */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Dịch vụ tại trung tâm</Text>
          {services && services.length > 0 ? (
            <FlatList
              data={services}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() =>
                    navigation.navigate("ServiceDetails", {
                      tenDichVu: item.tendichvu,
                      hinhAnhDichVu: item.hinhanh,
                      moTaDichVu: item.mota,
                      giaDichVu: item.gia,
                      thoiGianThucHien: item.thoigianthuchien,
                    })
                  }
                >
                  <Image
                    style={styles.serviceImage}
                    source={{ uri: item.hinhanh }}
                  />
                  <Text style={styles.serviceText}>{item.tendichvu}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.iddichvu.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noServicesText}>Không có dịch vụ nào.</Text>
          )}
        </View>
      </ScrollView>

      {/* Nút đặt lịch ngay */}
      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() =>
          navigation.navigate("Booking", { centerId: center.idtrungtam })
        }
      >
        <Text style={styles.scheduleButtonText}>Đặt lịch ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9", // Màu nền nhẹ hơn
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, 
  },
  centerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#2c3e50", // Màu tiêu đề tối hơn
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
    color: "#7f8c8d", // Màu mô tả nhẹ hơn
  },
  readMoreContainer: {
    marginTop: 1,
  },
  readMoreContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreButton: {
    color: "#3498db", // Màu xanh dương sáng
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 5,
  },
  readMoreIcon: {
    marginTop: 2,
  },
  contactContainer: {
    marginVertical: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
    color: "#34495e", // Màu văn bản tối hơn
  },
  servicesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50", // Màu tiêu đề dịch vụ
  },
  serviceItem: {
    marginRight: 15,
    alignItems: "center",
    padding: 5,
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50", // Màu chữ dịch vụ
  },
  noServicesText: {
    fontSize: 16,
    color: "#7f8c8d", // Màu thông báo không có dịch vụ
    textAlign: "center",
    marginTop: 10,
  },
  scheduleButton: {
    position: "absolute", // Đặt cố định nút
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: "#e67e22", // Màu cam nhạt
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
});


export default CenterDetails;
