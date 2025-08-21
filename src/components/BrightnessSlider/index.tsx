import { StyleSheet } from 'react-native';
import { useLightStore } from '../../store/lightStored';
import Animated, { runOnJS, useAnimatedGestureHandler, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { useMemo, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Canvas, Circle, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';

const WIDTH = 390;
const HEIGHT = 24;
const R = 14;

export function BrightnessSlider() {
    const brightness = useLightStore((state) => state.brightness);
    const setBrightness = useLightStore((state) => state.setBrightness);

    // Tính toán vị trí x ban đầu dựa trên brightness
    const initialX = (brightness / 100) * (WIDTH - 2 * R) + R;
    const x = useSharedValue(initialX);

    // Sync shared value khi brightness thay đổi từ bên ngoài
    useEffect(() => {
        const newX = (brightness / 100) * (WIDTH - 2 * R) + R;
        x.value = withSpring(newX, { damping: 15, stiffness: 150 });
    }, [brightness, x]);

    const publishThrottled = useMemo(() => throttle((value: number) => setBrightness(value, true), 60), [setBrightness]);

    const onGesture = useAnimatedGestureHandler({
        onStart: (_, context: any) => {
            context.offsetX = x.value;
        },
        onActive: (event, context: any) => {
            // Tính toán vị trí mới
            let newX = context.offsetX + event.translationX;

            // Giới hạn circle không được vượt quá biên
            const minX = R; // Điểm đầu (0%)
            const maxX = WIDTH - R; // Điểm cuối (100%)

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
        },
        onEnd: () => {
            // Đảm bảo vị trí cuối cùng nằm trong giới hạn
            const minX = R;
            const maxX = WIDTH - R;
            if (x.value < minX) x.value = minX;
            if (x.value > maxX) x.value = maxX;
        }
    })

    const knobX = useDerivedValue(() => {
        // Đảm bảo giá trị hợp lệ
        const value = x.value;
        const minX = R;
        const maxX = WIDTH - R;
        return Math.max(minX, Math.min(maxX, value));
    });

    return (
        <Animated.View style={styles.container}>

            <PanGestureHandler onGestureEvent={onGesture}>
                <Animated.View style={styles.sliderContainer}>
                    <Canvas style={styles.canvas}>
                        {/* Background track - toàn bộ slider */}
                        <RoundedRect x={0} y={0} width={WIDTH} height={HEIGHT} r={HEIGHT / 2}>
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(WIDTH, 0)}
                                colors={['#5F648B', '#5F648B']}
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
                                colors={['#5F648B', '#ECEDF5']}
                            />
                        </RoundedRect>

                        {/* Knob inner circle */}
                        <Circle
                            cx={knobX as unknown as number}
                            cy={HEIGHT / 2}
                            r={R}
                            color="#FFFFFF"
                        />
                    </Canvas>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
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