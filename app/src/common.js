import { Alert, Plataform, Platform } from 'react-native'

const server = Platform.OS === 'ios'
    ? 'http://localhost:3333'
    : 'http://10.0.2.2:3333'

function showError(err) {
    if (err.response && err.response.data) {
        Alert.alert('Ocorreu um erro!', `${err.response.data}`)
    } else {
        Alert.alert('Ocorreu um erro!', `${err}`)
    }
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSuccess }