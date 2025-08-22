import { StyleSheet, Text, View } from 'react-native'
import { useLightStore } from '../../store/lightStored';
import { CTTSlider } from '../../components/CTTSlider';
import { LinearGradient } from 'react-native-linear-gradient';
import { Header } from './header';
import PagerView from 'react-native-pager-view';
import React, { useRef, useState } from 'react';
import { ColorSelection } from 'components/ColorSelection';

export function HomeScreen() {
    // const mode = useLightStore((state) => state.mode);
    // const setMode = useLightStore((state) => state.setMode);
    const on = useLightStore((state) => state.on);

    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState<number>(0);

    const handleSelectPage = (index: number) => {
        if (!on) return;

        setPage(index);
        if (pagerRef.current) pagerRef.current.setPage(index);
    };

    return (
        <>
            <Header />
            <LinearGradient
                colors={['#002651', '#003366']}
                style={styles.container}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={!on && styles.disabled}>
                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TabPill label="Nhiệt độ màu" active={page === 0} onPress={() => handleSelectPage(0)} />
                        <TabPill label="Màu sắc" active={page === 1} onPress={() => handleSelectPage(1)} />
                    </View>

                    {/* Pager */}
                    <PagerView
                        ref={pagerRef}
                        style={styles.pager}
                        initialPage={page}
                        onPageSelected={(e) => handleSelectPage(e.nativeEvent.position)}
                        scrollEnabled={on}
                    >
                        {/* Page 0: Nhiệt độ màu */}
                        <View key="ctt" style={styles.page}>
                            <View style={styles.cctContainer}>
                                <Text style={styles.cctTitle}>Thay đổi nhiệt độ màu</Text>
                                <CTTSlider />
                            </View>
                        </View>

                        {/* Page 1: Màu sắc */}
                        <View key="color" style={styles.page}>
                            <View style={styles.colorContainer}>
                                <Text style={styles.colorTitle}>Thay đổi màu sắc</Text>
                                <ColorSelection />
                            </View>
                        </View>
                    </PagerView>
                </View>
            </LinearGradient>
        </>
    )
}

function TabPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Text onPress={onPress} style={[styles.tabPill, active ? styles.tabPillActive : styles.tabPillInactive]}>
            {label}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    disabled: {
        opacity: 0.5,
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
    tabsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 8,
    },
    tabPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
        fontSize: 12,
    },
    tabPillActive: {
        color: 'white',
        backgroundColor: '#18A4AB',
        fontWeight: '600'
    },
    tabPillInactive: {
        color: 'white',
        backgroundColor: '#2C3E50'
    },
    pager: {
        height: 600,
        marginTop: 8,
    },
    page: {
        flex: 1,
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
        marginBottom: 20,
    },
    colorTitle: {
        color: 'white',
        marginBottom: 8,
    },
})