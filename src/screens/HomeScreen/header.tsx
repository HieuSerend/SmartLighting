import { LinearGradient } from "react-native-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import PowerSwitch from "../../components/PowerSwitch";

export function Header() {
    return <LinearGradient
        colors={['#2E798C', '#0054B4']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
    >
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Điều chỉnh đèn</Text>
                <PowerSwitch />
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    },
})