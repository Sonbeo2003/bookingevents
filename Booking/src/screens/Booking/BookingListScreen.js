import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CancelModel from "../../compoment/CancelModal/CancelModel";
import PaymentScreen from "../../screens/PaymentScreen/PaymentScreen";

const Tab = createMaterialTopTabNavigator();

const BookingListScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const getUserId = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.idnguoidung);
      }
    } catch (error) {
      console.error("Lỗi khi lấy id người dùng:", error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const fetchPendingBookings = async (userId) => {
    try {
      const response = await axios.get(
        `${url}/API_Events/Trangthai/get_pending_bookings.php?idnguoidung=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn chờ xác nhận:", error);
      return [];
    }
  };

  const fetchInProgressBookings = async (userId) => {
    try {
      const response = await axios.get(
        `${url}/API_Events/Trangthai/get_inprogress_bookings.php?idnguoidung=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đang thực hiện:", error);
      return [];
    }
  };

  const fetchCompletedBookings = async (userId) => {
    try {
      const response = await axios.get(
        `${url}/API_Events/Trangthai/get_completed_bookings.php?idnguoidung=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn hoàn thành:", error);
      return [];
    }
  };

  const fetchPaidBookings = async (userId) => {
    try {
      const response = await axios.get(
        `${url}/API_Events/Trangthai/get_paid_bookings.php?idnguoidung=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đã thanh toán:", error);
      return [];
    }
  };

  const fetchCancelledBookings = async (userId) => {
    try {
      const response = await axios.get(
        `${url}/API_Events/Trangthai/get_cancelled_bookings.php?idnguoidung=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đã hủy:", error);
      return [];
    }
  };

  const handleCancel = async (reason) => {
    console.log("Lý do hủy gửi đi:", reason);
    if (!reason) {
      Alert.alert("Thông báo", "Vui lòng nhập lý do hủy.");
      return;
    }

    try {
      const response = await axios.post(`${url}/API_Events/cancel_booking.php`, {
        idlichhen: selectedBookingId,
        idnguoidung: userId,
        lydohuy: reason,
      });

      if (response.data.success) {
        Alert.alert("Thông báo", "Hủy lịch hẹn thành công!");
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message || "Có lỗi khi hủy lịch hẹn."
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
    }

    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const submitCancelReason = (reason) => {
    console.log("Lý do hủy:", reason);
    handleCancel(reason);
  };

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const openPaymentModal = (booking) => {
    navigation.navigate("PaymentScreen", { booking });
  };

  const trangthai = {
    0: "Chờ xác nhận",
    1: "Đang thực hiện",
    2: "Hoàn thành",
    3: "Đã thanh toán",
    4: "Đã hủy",
  };

  const BookingTab = ({
    fetchBookings,
    showCancelButton,
    showPaymentButton,
  }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        const userId = await AsyncStorage.getItem("user")
          .then((user) => JSON.parse(user).idnguoidung)
          .catch(() => null);

        if (userId) {
          setLoading(true);
          const data = await fetchBookings(userId);
          setBookings(data);
          setLoading(false);
        }
      };

      fetchData();
    }, [fetchBookings]);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.tabContainer}>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                {/* Nội dung hiển thị lịch hẹn */}
                <View style={styles.bookingInfo}>
                  <Icon name="info-circle" size={20} color="#fff" />
                  <Text style={styles.text}>Sự kiện: {item.tensukien}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="map-marker" size={20} color="#fff" />
                  <Text style={styles.text}> Địa điểm: {item.tentrungtam}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="calendar" size={20} color="#fff" />
                  <Text style={styles.text}>Ngày hẹn: {item.ngayhen}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="clock-o" size={20} color="#fff" />
                  <Text style={styles.text}>Thời gian: {item.thoigianhen}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="info-circle" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Trạng thái: {trangthai[item.trangthai]}
                  </Text>
                </View>
                {/* Hiển thị các dịch vụ */}
                {item.dichvu && item.dichvu.length > 0 && (
                  <View style={styles.bookingInfo}>
                    <Icon name="cogs" size={20} color="#fff" />
                    <Text style={styles.text}>Dịch vụ: {item.dichvu}</Text>
                  </View>
                )}
                {/* Hiển thị nút hủy nếu cần */}
                {showCancelButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => openCancelModal(item.idlichhen)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
                  </TouchableOpacity>
                )}
                {/* Hiển thị nút thanh toan nếu cần */}
                {showPaymentButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => openPaymentModal(item)}
                  >
                    <Text style={styles.cancelButtonText}>Thanh toán</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            keyExtractor={(item) => item.idlichhen.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noBookingsContainer}>
            <Icon name="exclamation-circle" size={50} color="#FFCC33" />
            <Text style={styles.noBookingsText}>Không có lịch hẹn nào.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Quản lý lịch hẹn</Text> */}

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, color: "#333" },
          tabBarIndicatorStyle: { backgroundColor: "#333" },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 120 },
          tabBarShowIcon: true,
          tabBarStyle: { backgroundColor: "#e0f7fa" },
        }}
      >
        <Tab.Screen
          name="Chờ xác nhận"
          children={() => (
            <BookingTab
              fetchBookings={fetchPendingBookings}
              showCancelButton={true}
              showPaymentButton={false}
            />
          )}
          options={{
            tabBarLabel: "Chờ xác nhận",
            tabBarIcon: ({ color }) => (
              <Icon name="hourglass-start" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Đang thực hiện"
          children={() => (
            <BookingTab
              fetchBookings={fetchInProgressBookings}
              showCancelButton={false}
              showPaymentButton={false}
            />
          )}
          options={{
            tabBarLabel: "Đang thực hiện",
            tabBarIcon: ({ color }) => (
              <Icon name="spinner" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Hoàn thành"
          children={() => (
            <BookingTab
              fetchBookings={fetchCompletedBookings}
              showCancelButton={false}
              showPaymentButton={true}
            />
          )}
          options={{
            tabBarLabel: "Hoàn thành",
            tabBarIcon: ({ color }) => (
              <Icon name="trophy" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Đã thanh toán"
          children={() => (
            <BookingTab
              fetchBookings={fetchPaidBookings}
              showCancelButton={false}
              showPaymentButton={false}
            />
          )}
          options={{
            tabBarLabel: "Đã thanh toán",
            tabBarIcon: ({ color }) => (
              <Icon name="check-circle" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Đã hủy"
          children={() => (
            <BookingTab
              fetchBookings={fetchCancelledBookings}
              showCancelButton={false}
              showPaymentButton={false}
            />
          )}
          options={{
            tabBarLabel: "Đã hủy",
            tabBarIcon: ({ color }) => (
              <Icon name="times-circle" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* Modal lý do hủy */}
      <CancelModel
        visible={showCancelModal}
        onCancel={closeCancelModal}
        onSubmit={submitCancelReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingCard: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ffd740",
    margin: 10,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  noBookingsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  tabContainer: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BookingListScreen;
