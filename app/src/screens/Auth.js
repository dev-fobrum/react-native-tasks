import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import AuthInput from '../components/AuthInput'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyle'
import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false,
}

export default class Auth extends Component {
    state = {
        ...initialState
    }

    signOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            showSuccess('Usuário cadastrado!')
            this.setState({ ...initialState })
        } catch (e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)
        } catch (e) {
            showError(e)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.length >= 3)
            validations.push(this.state.confirmPassword)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground style={styles.background} source={backgroundImage}>
                <Text style={styles.title}>Tasks</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew
                            ? 'Crie sua conta'
                            : 'Informe seus dados'
                        }
                    </Text>
                    {
                        this.state.stageNew &&
                        <AuthInput
                            icon="user"
                            placeholder="Nome"
                            value={this.state.name}
                            style={styles.input}
                            onChangeText={name => this.setState({ name })}
                        />
                    }
                    <AuthInput
                        icon="at"
                        placeholder="E-mail"
                        value={this.state.email}
                        style={styles.input}
                        onChangeText={email => this.setState({ email })}
                    />
                    <AuthInput
                        icon="lock"
                        placeholder="Senha"
                        value={this.state.password}
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                    />
                    {
                        this.state.stageNew &&
                        <AuthInput
                            icon="asterisk"
                            placeholder="Confirmar Senha"
                            value={this.state.confirmPassword}
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        />
                    }

                    <TouchableOpacity
                        onPress={this.signOrSignup}
                        disabled={!validForm}
                    >
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew
                                    ? 'Registrar'
                                    : 'Entrar'
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ padding: 30 }}
                    onPress={
                        () => this.setState({ stageNew: !this.state.stageNew })
                    }>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew
                            ? 'Já possui conta?'
                            : 'Ainda não possui conta?'
                        }
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        textAlign: 'center',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        width: '90%',
    },
    input: {
        backgroundColor: '#FFF',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    }
})