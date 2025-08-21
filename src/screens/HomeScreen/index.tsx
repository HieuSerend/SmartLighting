import { StyleSheet, Text, View } from 'react-native'
import { useLightStore } from '../../store/lightStored';
import { CTTSlider } from '../../components/CTTSlider';
import { LinearGradient } from 'react-native-linear-gradient';
import { Header } from './header';
import PagerView from 'react-native-pager-view';
import React, { useEffect, useRef, useState } from 'react';

export function HomeScreen() {
    const mode = useLightStore((state) => state.mode);
    const on = useLightStore((state) => state.on);
    const setMode = useLightStore((state) => state.setMode);

    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState<number>(mode === 'rgb' ? 1 : 0);

    // Khi đổi page -> cập nhật mode
    const handleSelectPage = (index: number) => {
        setPage(index);
        if (pagerRef.current) pagerRef.current.setPage(index);
        if (index === 0) setMode('white', false);
        if (index === 1) setMode('rgb', false);
    };

    // Khi mode trong store đổi -> cập nhật pager
    useEffect(() => {
        const idx = mode === 'rgb' ? 1 : 0;
        if (idx !== page) {
            setPage(idx);
            if (pagerRef.current) pagerRef.current.setPage(idx);
        }
    }, [mode, page]);

    return (
        <>
            <Header />
            <LinearGradient
                colors={['#002651', '#003366']}
                style={styles.container}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View>
                    {on ? (
                        <>
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
                            >
                                {/* Page 0: Nhiệt độ màu */}
                                <View key="ctt" style={styles.page}>
                                    <View style={styles.cctContainer}>
                                        <CTTSlider />
                                    </View>
                                </View>

                                {/* Page 1: Màu sắc */}
                                <View key="color" style={styles.page}>
                                    <View style={styles.colorContainer}>
                                        <Text style={styles.colorTitle}>Màu sắc</Text>
                                        {/* TODO: Thay thế bằng Color Wheel sau */}
                                    </View>
                                </View>
                            </PagerView>
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
        height: 560,
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
        marginBottom: 8,
    },
    colorTitle: {
        color: 'white',
        marginBottom: 8,
    },
})