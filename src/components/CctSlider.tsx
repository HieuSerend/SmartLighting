import Animated, { runOnJS, useAnimatedGestureHandler, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useLightStore } from "../store/lightStored";
import { useMemo } from "react";
import throttle from "lodash.throttle";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Canvas, Circle, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";

const WIDTH = 280;
const HEIGHT = 36;
const R = 14;

const K_MIN = 2700, K_MAX = 6500;
export default function CctSlider() {
    const cct = useLightStore((state) => state.cct);
    const setCct = useLightStore((state) => state.setCct);

    const x = useSharedValue((cct - K_MIN) / (K_MAX - K_MIN) * WIDTH);

    const publishThrottled = useMemo(() => throttle((k: number) => setCct(k, true), 60), [setCct]);

    const onGesture = useAnimatedGestureHandler({
        onStart: (_, context: any) => {
            context.offsetX = x.value;
        },
        onActive: (event, context: any) => {
            let newX = context.offsetX + event.translationX;
            newX = Math.max(0, Math.min(WIDTH, newX));
            x.value = newX;
            const val = Math.round(K_MIN + (K_MAX - K_MIN) * newX / WIDTH);
            runOnJS(setCct)(val, false);
            runOnJS(publishThrottled)(val);
        }
    })

    const knobX = useDerivedValue(() => x.value);

    return (
        <PanGestureHandler onGestureEvent={onGesture}>
            <Animated.View style={{ width: WIDTH, height: HEIGHT + R * 2 }}>
                <Canvas style={styles.container}>
                    <Rect x={0} y={R} width={WIDTH} height={HEIGHT}>
                        <LinearGradient
                            start={vec(0, R)}
                            end={vec(WIDTH, R)}
                            colors={['#FFD7A3', '#FFF7DA', '#F1FAFF', '#CFE9FF', '#A7D0FF']}
                        />
                    </Rect>
                    <Circle cx={knobX as unknown as number} cy={R + HEIGHT / 2} r={R} color="#EDEDED" />
                </Canvas>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});