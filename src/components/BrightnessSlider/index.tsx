import { StyleSheet } from 'react-native';
import { useLightStore } from '../../store/lightStored';
import Animated, { runOnJS, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { useMemo, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';

const WIDTH = 390;
const HEIGHT = 24;
const R = 14;

export function BrightnessSlider() {
    const brightness = useLightStore((state) => state.brightness);
    const setBrightness = useLightStore((state) => state.setBrightness);
    const on = useLightStore((state) => state.on);

    // Tính toán vị trí x ban đầu dựa trên brightness
    const initialX = (brightness / 100) * (WIDTH - 2 * R) + R;
    const x = useSharedValue(initialX);
    const startX = useSharedValue(x.value);

    // Sync shared value khi brightness thay đổi từ bên ngoài
    useEffect(() => {
        const newX = (brightness / 100) * (WIDTH - 2 * R) + R;
        x.value = withSpring(newX, { damping: 15, stiffness: 150 });
    }, [brightness, x]);

    const publishThrottled = useMemo(() => throttle((value: number) => setBrightness(value, true), 60), [setBrightness]);

    const onGesture = Gesture.Pan()
        .enabled(on)
        .onStart(() => {
            startX.value = x.value;
        })
        .onUpdate((event) => {
            if (!on) return;

            // Tính toán vị trí mới
            let newX = startX.value + event.translationX;

            // Giới hạn circle không được vượt quá biên
            const minX = R; // Điểm đầu (0%)
            const maxX = WIDTH; // Điểm cuối (100%)

            newX = Math.max(minX, Math.min(maxX, newX));
            x.value = newX;

            // Tính toán giá trị brightness từ vị trí x
            const range = maxX - minX;
            if (range > 0) {
                const val = Math.round(100 * ((newX - minX) / range));
                const clampedVal = Math.max(0, Math.min(100, val));

                // Cập nhật UI và publish
                runOnJS(setBrightness)(clampedVal, false);
                runOnJS(publishThrottled)(clampedVal);
            }
        })
        .onEnd(() => {
            if (!on) return;
            // Đảm bảo vị trí cuối cùng nằm trong giới hạn
            const minX = R;
            const maxX = WIDTH;
            if (x.value < minX) x.value = minX;
            if (x.value > maxX) x.value = maxX;
        });

    const knobX = useDerivedValue(() => {
        // Đảm bảo giá trị hợp lệ
        const value = x.value;
        const minX = R;
        const maxX = WIDTH;
        return Math.max(minX, Math.min(maxX, value));
    });

    const colors = {
        background: ['#5F648B', '#5F648B'],
        active: ['#5F648B', '#ECEDF5'],
        knob: '#FFFFFF',
    }

    return (
        <Animated.View style={styles.container}>

            <GestureDetector gesture={onGesture}>
                <Animated.View style={[styles.sliderContainer, !on && styles.disabled]}>
                    <Canvas style={styles.canvas}>
                        {/* Background track - toàn bộ slider */}
                        <RoundedRect x={0} y={0} width={WIDTH - 1} height={HEIGHT} r={HEIGHT / 2}>
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(WIDTH, 0)}
                                colors={colors.background}
                            />
                        </RoundedRect>

                        {/* Active track - phần đã được chọn */}
                        <RoundedRect
                            x={0}
                            y={0}
                            width={knobX as unknown as number}
                            height={HEIGHT}
                            r={R}
                        >
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(WIDTH, 0)}
                                colors={colors.active}
                            />
                        </RoundedRect>

                        {/* Knob inner circle
                        <Circle
                            cx={knobX as unknown as number - 0.5}
                            cy={HEIGHT / 2}
                            r={HEIGHT / 2}
                            color={colors.knob}
                        /> */}
                    </Canvas>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    disabled: {
        opacity: 0.5,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    sliderContainer: {
        width: WIDTH,
        height: HEIGHT,
    },
    canvas: {
        flex: 1,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: WIDTH,
        paddingHorizontal: R,
    },
    minLabel: {
        color: '#95A5A6',
        fontSize: 12,
    },
    maxLabel: {
        color: '#95A5A6',
        fontSize: 12,
    },
})