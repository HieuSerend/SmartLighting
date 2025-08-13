import { StyleSheet, Text, View } from 'react-native'

export function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>This is HomeScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})