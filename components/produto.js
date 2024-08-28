import { useCallback } from 'react';
import { Pressable, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export function Produto({ data, onDelete, isSelected, onPress }) {
    const [fontsLoaded] = useFonts({
        'Light': require('../assets/fonts/Quicksand-Light.ttf'),
        'Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
        'Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
        'Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Pressable
            style={[styles.container, isSelected && styles.selectedContainer]}
            onPress={onPress}
            onLayout={onLayoutRootView}
        >
            <View style={styles.Item}>
                <View style={styles.textosItens}>
                    <Text style={[styles.text, isSelected && styles.selectedText]}>
                        Nome:
                    </Text>
                    <Text style={[styles.escrito, isSelected && styles.selectedText]}>
                        {data.nome}
                    </Text>
                </View>
                <View style={styles.textosItens}>
                    <Text style={[styles.text, isSelected && styles.selectedText]}>
                        Quantidade:
                    </Text>
                    <Text style={[styles.escrito, isSelected && styles.selectedText]}>
                        {data.quantidade}
                    </Text>
                </View>
            </View>

            <TouchableOpacity onPress={onDelete}>
                <MaterialIcons name="delete" size={28} color={isSelected ? "#FFFFFF" : "#001969"} />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 25,
        gap: 12,
        shadowColor: '#E6E4E4', // Cor da sombra
        shadowOffset: { width: 0, height: 1 }, // Deslocamento da sombra
        shadowOpacity: 0.8, // Opacidade da sombra
        shadowRadius: 3, // Raio de desfoque da sombra
        elevation: 5, // Adiciona sombra em Android
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
    },
    selectedContainer: {
        backgroundColor: '#001969',
    },
    textosItens: {
        flexDirection: 'row',
        gap: 10
    },
    text: {
        fontFamily: 'Bold',
        color: '#001969',
        fontSize: 20
    },
    escrito: {
        fontFamily: 'Regular',
        color: '#001969',
        fontSize: 20
    },
    selectedText: {
        color: '#FFFFFF',
    }
});
