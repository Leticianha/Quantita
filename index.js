import { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Alert, FlatList, Text, StatusBar, Image } from 'react-native';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Estado para o item selecionado

    const [fontsLoaded] = useFonts({
        'Light': require('./assets/fonts/Quicksand-Light.ttf'),
        'Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
        'Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
        'Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const produtosBD = usarBD();

    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }

        try {
            const item = await produtosBD.create({
                nome,
                quantidade,
            });
            Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
            setId(item.idProduto);

            listar();
            resetForm(); // Limpa o formulário após salvar
        } catch (error) {
            console.log(error);
        }
    }

    async function update() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }

        try {
            if (selectedId) {
                // Atualiza o item existente
                await produtosBD.update(selectedId, {
                    nome,
                    quantidade,
                });
                Alert.alert('Produto atualizado!');

                listar();
                resetForm(); // Limpa o formulário após atualizar
            } else {
                Alert.alert('Nenhum produto selecionado para atualização.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listar();
    }, [pesquisa]);

    const del = async (id) => {
        try {
            await produtosBD.del(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    const resetForm = () => {
        setNome('');
        setQuantidade('');
        setSelectedId(null);
    };

    const handleSelect = (item) => {
        setSelectedId(item.id);
        setNome(item.nome);
        setQuantidade(String(item.quantidade)); // Garante que a quantidade seja uma string para o TextInput
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" backgroundColor="#0D47A1" // Cor de fundo da barra de status
            />

            <View style={styles.comeco}>
                <View style={styles.header}>
                    <Image source={require('./assets/logo.png')} style={styles.logo} />
                    <Text style={styles.titulo}>Quantita</Text>
                </View>

                <View style={styles.pesquisa}>
                    <TextInput
                        style={styles.inputPesquisa}
                        placeholder="Pesquisa"
                        onChangeText={setPesquisa}
                    />
                    <Feather name="search" size={24} color="#421B41" />
                </View>

            </View>

            <TextInput
                style={styles.input}
                placeholder="Insira o nome"
                onChangeText={setNome}
                value={nome}
            />
            <TextInput
                style={styles.input}
                placeholder="Insira a quantidade"
                onChangeText={setQuantidade}
                value={quantidade}
                keyboardType="numeric" // Garante que o teclado numérico seja exibido
            />

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.botao} onPress={create}>
                    <Text style={styles.botaoTexto}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botao} // Estilo separado para o botão de atualizar
                    onPress={update}
                >
                    <Text style={styles.botaoTexto}>Atualizar</Text>
                </TouchableOpacity>
            </View>



            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto
                        data={item}
                        onDelete={() => del(item.id)}
                        isSelected={item.id === selectedId}
                        onPress={() => handleSelect(item)} // Seleciona o item
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEFFF',
        padding: 30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10
    },
    logo: {
        width: 35,
        height: 45
    },
    titulo: {
        fontSize: 25,
        fontFamily: 'Bold'
    },
    pesquisa: {
        flexDirection: 'row'
    }
});