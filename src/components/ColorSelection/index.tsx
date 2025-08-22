import { StyleSheet, View } from "react-native";
import { useLightStore } from "store/lightStored";
import Animated from "react-native-reanimated";
import ColorPicker from "react-native-wheel-color-picker";

export function ColorSelection() {
  const colorCode = useLightStore((state) => state.colorCode);
  const setColorCode = useLightStore((state) => state.setColorCode);
  const on = useLightStore((state) => state.on);

  const onColorChange = (color: string) => {
    setColorCode(color);
  };

  return (
    <Animated.View style={styles.container}>
      <View style={styles.colorPicker}>
        <ColorPicker
          color={colorCode}
          onColorChange={onColorChange}
          disabled={!on}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  colorPicker: {
    width: '100%',
    height: 200,
  },
})