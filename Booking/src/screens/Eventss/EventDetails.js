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

const EventDetails = ({ route, navigation }) => {
    const { tensukien, loaisukien, trungtam, starttime, endtime, trangthai } =
        route.params;


    // Hàm format giờ
    const formatTimeWithText = (time) => {
        if (!time) return "";

        const [hours, minutes] = time.split(":").map(Number);

        let period = "sáng";
        if (hours >= 12) period = "chiều";
        if (hours >= 18) period = "tối";

        const formattedHours = hours > 12 ? hours - 12 : hours;
        return `${formattedHours} giờ ${minutes.toString().padStart(2, "0")} phút - ${period}`;
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Phần hình ảnh sự kiện */}
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.eventImage}
                        source={{
                            uri: "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/7/1350357/Khai-Mac-1.JPG", // Thay bằng ảnh mặc định hoặc từ API
                        }}
                    />
                </View>

                {/* Phần thông tin sự kiện */}
                <View style={styles.contentContainer}>
                    <Text style={styles.eventTitle}>{tensukien}</Text>
                    <Text style={styles.eventDetail}>
                        <Text style={styles.detailLabel}>Loại sự kiện: </Text>
                        {loaisukien}
                    </Text>
                    <Text style={styles.eventDetail}>
                        <Text style={styles.detailLabel}>Trung tâm tổ chức: </Text>
                        {trungtam}
                    </Text>
                    <Text style={styles.eventDetail}>
                        <Text style={styles.detailLabel}>Thời gian bắt đầu: </Text>
                        {formatTimeWithText(starttime)}
                    </Text>
                    <Text style={styles.eventDetail}>
                        <Text style={styles.detailLabel}>Thời gian kết thúc: </Text>
                        {formatTimeWithText(endtime)}
                    </Text>
                    <Text style={styles.eventDetail}>
                        <Text style={styles.detailLabel}>Trạng thái: </Text>
                        {trangthai}
                    </Text>
                </View>
            </ScrollView>

            {/* Nút Đặt lịch */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("Booking")}
                >
                    <Text style={styles.actionButtonText}>Đặt lịch ngay</Text>
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
        paddingBottom: 80, // Để khoảng trống cho nút đăng ký
    },
    imageContainer: {
        height: 250,
        justifyContent: "center",
        alignItems: "center",
    },
    eventImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    contentContainer: {
        padding: 20,
    },
    eventTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    eventDetail: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
        marginBottom: 10,
    },
    detailLabel: {
        fontWeight: "bold",
        color: "#555",
    },
    actionContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
    },
    actionButton: {
        backgroundColor: "#f9b233",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default EventDetails;
