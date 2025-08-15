import { StyleSheet, Text, View } from 'react-native'
import { useLightStore } from '../../store/lightStored';
import BrightnessSlider from '../../components/BrightnessSlider';
import CctSlider from '../../components/CctSlider';
import { LinearGradient } from 'react-native-linear-gradient';
import { Header } from './header';

export function HomeScreen() {
    const mode = useLightStore((state) => state.mode);
    const on = useLightStore((state) => state.on);

    return (
        <>
            <Header />
            <LinearGradient
                colors={['#002651', '#003366']}
                style={styles.container}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {/* Main Content */}
                <View>
                    {on ? (
                        <>
                            <View style={styles.brightnessContainer}>
                                <BrightnessSlider />
                            </View>

                            {mode === 'white' ? (
                                <View style={styles.cctContainer}>
                                    <Text style={styles.cctTitle}>Nhiệt độ màu</Text>
                                    <CctSlider />
                                </View>
                            ) : (
                                <View style={styles.colorContainer}>
                                    <Text style={styles.colorTitle}>Chọn màu</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.offContainer}>
                            <Text style={styles.offText}>Đèn đang tắt</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </>
    )
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
    brightnessContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    brightnessTitle: {
        color: 'white',
        marginBottom: 8,
    },
    cctContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    colorContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    offContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    offText: {
        color: '#9fb3c8'
    },
    cctTitle: {
        color: 'white',
        marginBottom: 8,
    },
    colorTitle: {
        color: 'white',
        marginBottom: 8,
    },
})