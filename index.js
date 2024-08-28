import { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Alert, FlatList, Text, StatusBar, Image, ScrollView } from 'react-native';
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
    const [selectedId, setSelectedId] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

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
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" backgroundColor="#001969" // Cor de fundo da barra de status
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
                        placeholderTextColor='#001969'
                        onChangeText={setPesquisa}
                    />
                    <Feather name="search" size={24} color="#FFFFFF" />
                </View>

                <Text style={styles.infos}>
                    Adicione os itens abaixo com nome e quantidade, e guarde para consulta futura.
                </Text>

                <View style={styles.containerInput}>
                    <View style={styles.boxInput}>
                        <Image source={require('./assets/vetor.png')} style={styles.vetor} />
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o nome"
                            placeholderTextColor='#7269B1'
                            onChangeText={setNome}
                            value={nome}
                        />
                    </View>

                    <View style={styles.boxInput}>
                        <Image source={require('./assets/number.png')} style={styles.vetor} />
                        <TextInput
                            style={styles.input}
                            placeholder="Insira a quantidade"
                            placeholderTextColor='#7269B1'
                            onChangeText={setQuantidade}
                            value={quantidade}
                            keyboardType="numeric" // Garante que o teclado numérico seja exibido
                        />
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.botao, isHovered && styles.botaoHover]} onPress={create} activeOpacity={0.7}
                        onPressIn={() => setIsHovered(true)}
                        onPressOut={() => setIsHovered(false)}>
                        <Text style={styles.botaoTexto}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.botao, isHovered && styles.botaoHover]} onPress={update} activeOpacity={0.7} onPressIn={() => setIsHovered(true)} onPressOut={() => setIsHovered(false)}>
                        <Text style={styles.botaoTexto}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.final}>
                <Text style={styles.tituloFinal}>Itens adicionados</Text>

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
                    scrollEnabled={false}
                />
            </View>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001969',
    },
    comeco: {
        padding: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        marginBottom: 30
    },
    logo: {
        width: 28,
        height: 35
    },
    titulo: {
        fontSize: 25,
        fontFamily: 'Bold',
        color: '#FFFFFF'
    },
    pesquisa: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 50,
        height: 60,
        paddingRight: 20,
        marginBottom: 30
    },
    inputPesquisa: {
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        height: 60,
        width: 270,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: 'Medium',
        fontSize: 18,
    },
    infos: {
        fontFamily: 'Regular',
        fontSize: 20,
        color: '#FFFFFF',
        marginBottom: 30
    },
    containerInput: {
        gap: 30,
        marginBottom: 30
    },
    boxInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        height: 60,
        padding: 20
    },
    vetor: {
        width: 30,
        height: 30
    },
    input: {
        fontFamily: 'Medium',
        fontSize: 18,
        width: '83%'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botao: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 50,
        width: 160
    },
    botaoHover: {
        backgroundColor: '#7269B1',
        color: '#FFFFFF'
    },
    botaoTexto: {
        textTransform: 'uppercase',
        fontFamily: 'Bold',
        color: '#001969',
        fontSize: 18
    },
    final: {
        flex: 1,
        backgroundColor: '#F5F4FF',
        padding: 40
    },
    tituloFinal: {
        fontFamily:'Bold',
        fontSize: 23,
        color: '#001969',
        marginBottom: 20
    }
});