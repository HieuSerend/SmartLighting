import { View, Text, StyleSheet, Switch } from 'react-native';
import { useLightStore } from '../../store/lightStored';

export function PowerSwitch() {
    const on = useLightStore((state) => state.on);
    const setOn = useLightStore((state) => state.setOn);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bật/Tắt</Text>
            <Switch
                value={on}
                onValueChange={(value) => setOn(value, true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});