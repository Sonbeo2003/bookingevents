import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";
import "moment/locale/vi";

const BookingScreen = () => {
  const [centers, setCenters] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch(`${url}/API_Events/trungtam.php`);
        const data = await response.json();
        setCenters(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu địa điểm:", error);
      }
    };

    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setCustomerName(parsedUserData.tennguoidung);
          setPhoneNumber(parsedUserData.sodienthoai);
          setAddress(parsedUserData.diachi);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      }
    };

    const loadPets = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const parsedUserData = JSON.parse(userData);
        const response = await fetch(
          `${url}/API_Events/getthucungbynguoidung.php?idnguoidung=${parsedUserData.idnguoidung}`
        );
        const petData = await response.json();
        setPets(petData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sự kiện:", error);
      }
    };

    fetchCenters();
    loadUserData();
    loadPets();
  }, []);

  // Sử dụng useFocusEffect để tải lại danh sách thú cưng khi quay lại trang
  useFocusEffect(
    React.useCallback(() => {
      const loadPets = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          const parsedUserData = JSON.parse(userData);
          const response = await fetch(
            `${url}/API_Events/getthucungbynguoidung.php?idnguoidung=${parsedUserData.idnguoidung}`
          );
          const petData = await response.json();
          setPets(petData);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu sự kiện:", error);
        }
      };

      loadPets();
    }, [])
  );

  const handleCenterSelect = async (centerId) => {
    const selected = centers.find((center) => center.idtrungtam === centerId);
    setSelectedCenter(selected);
    setSelectedServices([]);
    try {
      const response = await fetch(
        `${url}/API_Events/getdichvu_trungtam.php?idtrungtam=${centerId}`
      );
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
    }
  };

  const onConfirmBooking = async () => {
    if (!selectedCenter || selectedServices.length === 0 || !selectedPet) {
      Alert.alert(
        "Lỗi",
        "Vui lòng chọn đầy đủ địa điểm, dịch vụ và sự kiện."
      );
      return;
    }

    try {
      const userData = await AsyncStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      const bookingData = {
        idnguoidung: parsedUserData.idnguoidung,
        idthucung: selectedPet,
        idtrungtam: selectedCenter.idtrungtam,
        ngayhen: selectedDate.toISOString().split("T")[0],
        thoigianhen: selectedTime.toTimeString().split(" ")[0],
        dichvu: selectedServices,
      };

      // Gửi yêu cầu tạo lịch hẹn
      const response = await fetch(`${url}/API_Events/themlichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (result.message === "Lịch hẹn đã được lưu thành công!") {
        // Hiển thị thông báo toast thành công
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đặt lịch hẹn thành công!",
          textStyle: { color: "#fff" },
          visibilityTime: 2000,
        });

        // Chuyển hướng về trang Home sau 2 giây
        setTimeout(() => {
          navigation.navigate("Home", { screen: "Lịch hẹn" });
        }, 2000);
      } else {
        // Hiển thị thông báo lỗi nếu có
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Có lỗi xảy ra khi đặt lịch hẹn.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(service.iddichvu)) {
        return prevSelected.filter((s) => s !== service.iddichvu);
      } else {
        return [...prevSelected, service.iddichvu];
      }
    });
  };

  // Hàm format ngày thành tiếng Việt
  const formatDate = (date) => {
    return moment(date).format("dddd, D MMMM YYYY");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hiển thị thông tin người dùng */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>Tên: {customerName}</Text>
        <Text style={styles.userInfoText}>Số điện thoại: {phoneNumber}</Text>
        <Text style={styles.userInfoText}>Địa chỉ: {address}</Text>
      </View>

      {/* Thêm thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chọn sự kiện</Text>
        {/* <TouchableOpacity
          style={styles.addPetButton}
          onPress={() => navigation.navigate("AddPet")}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addPetButtonText}>Thêm thú cưng</Text>
        </TouchableOpacity> */}

        <Picker
          selectedValue={selectedPet}
          onValueChange={(itemValue) => setSelectedPet(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn sự kiện" value={null} />
          {pets.map((pet) => (
            <Picker.Item
              key={pet.idthucung}
              label={pet.tensukien}
              value={pet.idthucung}
            />
          ))}
        </Picker>
      </View>

      {/* Chọn trung tâm */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa điểm</Text>
        <Picker
          selectedValue={selectedCenter?.idtrungtam}
          onValueChange={(itemValue) => handleCenterSelect(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn địa điểm" value={null} />
          {centers.map((center) => (
            <Picker.Item
              key={center.idtrungtam}
              label={center.tentrungtam}
              value={center.idtrungtam}
            />
          ))}
        </Picker>
      </View>

      {/* Chọn dịch vụ */}
      <Text style={styles.label}>Chọn dịch vụ</Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service.iddichvu}
          style={styles.serviceContainer}
          onPress={() => handleServiceToggle(service)}
        >
          <Text style={styles.serviceText}>
            {service.tendichvu} - {service.gia.toLocaleString("vi-VN")} VND
          </Text>
          {selectedServices.includes(service.iddichvu) && (
            <Icon name="check" size={20} color="#4caf50" />
          )}
        </TouchableOpacity>
      ))}

      {/* Chọn ngày */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>
          Chọn ngày: {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              const today = new Date();
              // Đặt thời gian của ngày hiện tại về 00:00:00 để so sánh chính xác
              today.setHours(0, 0, 0, 0);

              if (date < today) {
                Alert.alert("Lỗi", "Không thể chọn ngày trước ngày hiện tại.");
              } else {
                setSelectedDate(date);
              }
            }
          }}
        />
      )}

      {/* Chọn giờ */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timeButton}
      >
        <Text style={styles.timeButtonText}>
          Chọn giờ:{" "}
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}
      {/* Thông tin đặt lịch */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Thông tin đặt lịch:</Text>

        <View style={styles.groupsumary}>
          <Text>Tên: </Text>
          <Text>{customerName}</Text>
        </View>

        <View style={styles.groupsumary}>
          <Text>Số điện thoại: </Text>
          <Text>{phoneNumber}</Text>
        </View>

        {/* Trung tâm */}
        <View style={styles.groupsumary}>
          <Text>Địa điểm: </Text>
          <Text>{selectedCenter?.tentrungtam}</Text>
        </View>

        {/* Ngày tháng */}
        <View style={styles.groupsumary}>
          <Text>Ngày: </Text>
          <Text>{selectedDate.toLocaleDateString()}</Text>
        </View>

        {/* Giờ */}
        <View style={styles.groupsumary}>
          <Text> Giờ: </Text>
          <Text>{selectedTime.toLocaleTimeString()}</Text>
        </View>

        {/* Dịch vụ */}
        <View style={styles.groupsumary}>
          <Text> Dịch vụ: </Text>
          <Text>
            {" "}
            {services
              .filter((service) => selectedServices.includes(service.iddichvu))
              .map((service) => service.tendichvu)
              .join(", ")}
          </Text>
        </View>

        {/* Thú cưng */}
        <View style={styles.groupsumary}>
          <Text> Sự kiện: </Text>
          <Text>
            {" "}
            {pets.find((pet) => pet.idthucung === selectedPet)?.tensukien}
          </Text>
        </View>

        {/* Tổng tiền */}
        <Text
          style={{
            color: "#ff0000",
            marginTop: 10,
            paddingTop: 5,
            fontSize: 16,
            borderTopColor: "black",
            borderTopWidth: 0.3,
            fontWeight: "bold",
          }}
        >
          Tổng tiền dịch vụ:{" "}
          {services
            .filter((service) => selectedServices.includes(service.iddichvu))
            .reduce((total, service) => total + service.gia, 0)
            .toLocaleString("vi-VN")}{" "}
          VND
        </Text>
      </View>

      <TouchableOpacity onPress={onConfirmBooking} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận đặt lịch</Text>
      </TouchableOpacity>

      {/* Modal xác nhận */}
      {/* <BookingModal
        showModal={showModal}
        selectedCenter={selectedCenter}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedServices={selectedServices}
        services={services}
        pets={pets}
        selectedPet={selectedPet}
        onConfirmBooking={handleModalConfirm}
        onCancelBooking={handleModalCancel}
      /> */}
      <Toast position="bottom" bottomOffset={40} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f7fc",
  },

  userInfoContainer: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  userInfoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  addPetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9b233",
    borderRadius: 20,
    elevation: 3,
    marginBottom: 15,
  },
  addPetButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },

  picker: {
    height: 45,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  serviceText: {
    fontSize: 16,
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },

  dateButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    paddingVertical: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  summary: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  groupsumary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});

export default BookingScreen;
