import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";

import imgService1 from "../../../assets/anh1.jpg";
import imgService2 from "../../../assets/anh2.jpg";
import imgService3 from "../../../assets/anh3.jpg";
import imgService4 from "../../../assets/12822749.png";

const HomeScreen = ({ navigation }) => {
  const [dichvu, setDichvu] = useState([]);
  const [centers, setCenters] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredDichvu, setFilteredDichvu] = useState([]);
  const [user, setUser] = useState(""); // Trạng thái để lưu tên người dùng

  //Khai báo ảnh
  const serviceImages = {
    events1: imgService1, // Map tên hoặc ID dịch vụ với ảnh
    events2: imgService2,
    events3: imgService3,
    events4: imgService4
  };

  //Lấy danh sách sự kiện
  useEffect(() => {
    axios
      .get(`${url}API_Events/sukien.php`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sự kiện:", error);
      });
  }, []);


  // Lấy danh sách dịch vụ
  useEffect(() => {
    axios
      .get(`${url}API_Events/dichvu.php`)
      .then((response) => {
        setDichvu(response.data);
        setFilteredDichvu(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      });
  }, []);

  // Lấy danh sách trung tâm
  useEffect(() => {
    axios
      .get(`${url}API_Events/trungtam.php`)
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách trung tâm:", error);
      });
  }, []);

  // Lấy tên người dùng từ AsyncStorage
  useEffect(() => {
    const getUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user"); 
        if (userString) {
          const userObject = JSON.parse(userString); 
          console.log("Fetched user object:", userObject);
          setUser(userObject.tennguoidung); 
        }
      } catch (error) {
        console.error("Lỗi khi lấy tên người dùng:", error);
      }
    };
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              style={styles.headerImage}
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaU7H8XCsslaJa1DQJlr0_i1HzhBI5lvD1I93SbYriu4dEGU_2_apTOGZKNDqARjYAVJ0&usqp=CAU",
              }}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>
              Chào mừng,{"\n"}
              {user}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#fff"
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            style={styles.bannerImage}
            source={{
              uri: "https://www.teambuilding-danang.com/upload/hinhthem/11-7285.jpg",
            }}
          />
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => navigation.navigate("Booking")}
          >
            <Text style={styles.bookingButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách sự kiện */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Sự kiện</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.idthucung}
                style={styles.EventCard}
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    tensukien: event.tensukien,
                    loaisukien: event.loaisukien,
                    trungtam: event.trungtam,
                    starttime: event.starttime,
                    endtime: event.endtime,
                    trangthai: event.trangthai
                  })
                }
              >
                <Image
                  style={styles.EventImage}
                  source={serviceImages[events.idthucung] || imgService4}
                />
                <Text style={styles.serviceText}>{event.tensukien}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Danh sách dịch vụ */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Dịch vụ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredDichvu.map((dichvu) => (
              <TouchableOpacity
                key={dichvu.iddichvu}
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate("ServiceDetails", {
                    tenDichVu: dichvu.tendichvu,
                    hinhAnhDichVu: dichvu.hinhanh,
                    moTaDichVu: dichvu.mota,
                    giaDichVu: dichvu.gia,
                    thoiGianThucHien: dichvu.thoigianthuchien,
                  })
                }
              >
                <Image
                  style={styles.serviceImage}
                  source={{ uri: dichvu.hinhanh }}
                />
                <Text style={styles.serviceText}>{dichvu.tendichvu}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Danh sách trung tâm */}
        <View style={styles.centersContainer}>
          <Text style={styles.sectionTitle}>Địa điểm</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {centers.map((center) => (
              <TouchableOpacity
                key={center.idtrungtam}
                style={styles.centerCard}
                onPress={() =>
                  navigation.navigate("CenterDetails", {
                    center: {
                      idtrungtam: center.idtrungtam,
                      hinhanh: center.hinhanh,
                      tentrungtam: center.tentrungtam,
                      diachi: center.diachi,
                      sodienthoai: center.sodienthoai,
                      email: center.email,
                      X_location: center.X_location,
                      Y_location: center.Y_location,
                      mota: center.mota,
                    },
                  })
                }
              >
                <Image
                  style={styles.centerImage}
                  source={{ uri: center.hinhanh }}
                />
                <Text style={styles.centerText}>{center.tentrungtam}</Text>
                <View style={styles.addressContainer}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#555"
                    style={styles.addressIcon}
                  />
                  <Text style={styles.centerAddress}>{center.diachi}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    // backgroundColor: '#f9b233',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  notificationIcon: {
    marginRight: 10,
    color: "black",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  bannerContainer: {
    marginVertical: 10,
    alignItems: "center",
    position:'relative',
  },
  bannerImage: {
    width: "90%",
    height: 180,
    borderRadius: 10,
  },

  bookingButton: {
    width:95,
    height:20,
    position: 'absolute',
    bottom: 35, 
    left:36,
    backgroundColor: '#FF9900', 
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  servicesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  EventCard: {
    marginRight: 15,
    alignItems: "center",
    padding: 5,
  },
  EventImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2, 
    borderColor: "#3498db", 
  },
  serviceCard: {
    marginRight: 15,
    alignItems: "center",
    padding: 5,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2, 
    borderColor: "#f9b233", 
  },
  serviceText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
  },
  centersContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  centerCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centerImage: {
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  centerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  addressIcon: {
    marginRight: 5,
  },
  centerAddress: {
    fontSize: 14,
    color: "#555",
  },
});

export default HomeScreen;
