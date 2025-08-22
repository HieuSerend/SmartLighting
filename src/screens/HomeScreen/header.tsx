import { LinearGradient } from "react-native-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import { PowerSwitch } from "../../components/PowerSwitch";
import { BrightnessSlider } from "../../components/BrightnessSlider";

export function Header() {
    return <LinearGradient
        colors={['#002651', '#146585', '#038A83']}
        useAngle={true}
        angle={12}
        locations={[0.3, 0.7, 1]}
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12
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