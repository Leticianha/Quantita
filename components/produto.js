import { Pressable, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onDelete, isSelected, onPress }) {
    return (
        <Pressable
            style={[styles.container, isSelected && styles.selectedContainer]}
            onPress={onPress} // Seleciona o item ao pressioná-lo
        >
            <View style={styles.junto}>
                <Text style={styles.text}>
                    Nome: {data.nome}
                </Text>
                <Text style={styles.text}>
                    Quantidade: {data.quantidade}
                </Text>
            </View>

            <TouchableOpacity onPress={onDelete}>
                <MaterialIcons name="delete" size={28} color="black" />
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
        alignItems: 'center'
    },
    selectedContainer: {
        backgroundColor: '#F2F2F2',
        borderColor: '#000',
        borderWidth: 2
    },
    text: {
        fontSize: 20,
        color: '#000',
    },
});