import { LinearGradient } from "react-native-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import { PowerSwitch } from "../../components/PowerSwitch";
import { BrightnessSlider } from "../../components/BrightnessSlider";

export function Header() {
    return <LinearGradient
        colors={['#2E798C', '#0054B4']}
        useAngle={true}
        angle={45}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
    >
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Điều chỉnh đèn</Text>
                <PowerSwitch />
            </View>
            <View style={styles.brightnessContainer}>
                <BrightnessSlider />
            </View>
        </View>
    </LinearGradient>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    },
    brightnessContainer: {
        marginTop: 12,
    },
})