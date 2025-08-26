import Animated, { runOnJS, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useLightStore } from "../../store/lightStored";
import { useMemo } from "react";
import throttle from "lodash.throttle";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas, Circle, Line, LinearGradient, RoundedRect, vec } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";

const WIDTH = 270;
const HEIGHT = 526;
const R = 46;

const K_MIN = 2700, K_MAX = 6500;
export function CTTSlider() {
    const colorTemperature = useLightStore((state) => state.colorTemperature);
    const setColorTemperature = useLightStore((state) => state.setColorTemperature);
    const on = useLightStore((state) => state.on);

    // Keep knob fully inside by reserving radius padding at both ends
    const minY = R / 2;
    const maxY = HEIGHT - R / 2;
    const visibleRange = maxY - minY;

    // Convert color temperature to y coordinate
    const cctToY = (k: number) => minY + (Math.max(K_MIN, Math.min(K_MAX, k)) - K_MIN) * visibleRange / (K_MAX - K_MIN);

    const y = useSharedValue(cctToY(colorTemperature));
    const startY = useSharedValue(y.value);

    const publishThrottled = useMemo(() => throttle((k: number) => setColorTemperature(k, true), 60), [setColorTemperature]);

    const onGesture = Gesture.Pan()
        .enabled(on)
        .onStart(() => {
            startY.value = y.value;
        })
        .onUpdate((event) => {
            if (!on) return;

            let newY = startY.value + event.translationY;
            newY = Math.max(minY, Math.min(maxY, newY));
            y.value = newY;
            const val = Math.round(K_MIN + (K_MAX - K_MIN) * (newY - minY) / visibleRange);
            runOnJS(setColorTemperature)(val, false);
            runOnJS(publishThrottled)(val);
        })

    const knobY = useDerivedValue(() => y.value);

    // Đồng bộ di chuyển giữa circle và line
    const p1Left = useDerivedValue(() => vec(0, knobY.value));
    const p2Left = useDerivedValue(() => vec((WIDTH - R) / 2, knobY.value));
    const p1Right = useDerivedValue(() => vec((WIDTH + R) / 2, knobY.value));
    const p2Right = useDerivedValue(() => vec(WIDTH, knobY.value));

    return (
        <GestureDetector gesture={onGesture}>
            <Animated.View style={styles.cttContainer}>
                <Canvas style={styles.container}>
                    <RoundedRect x={0} y={0} width={WIDTH} height={HEIGHT} r={R}>
                        <LinearGradient
                            colors={["#B6FDF9", "#DDFCD6", "#F7E150"]}
                            start={vec(0, 0)}
                            end={vec(WIDTH, HEIGHT)}
                        />
                    </RoundedRect>
                    <Circle cx={WIDTH / 2} cy={knobY as unknown as number} r={R / 2} strokeWidth={1} style="stroke" />
                    <Line p1={p1Left} p2={p2Left} strokeWidth={1} style="stroke" />
                    <Line p1={p1Right} p2={p2Right} strokeWidth={1} style="stroke" />
                </Canvas>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    circle: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "white",
    },
    cttContainer: {
        width: WIDTH,
        height: HEIGHT,
    }
}); 