import React from 'react';
import './Authorization.css';
import { LogIn, Registration, ResetPassword } from './Components';
import { Route, withRouter, Switch } from 'react-router-dom';
import axios from 'axios';


// Компонент авторизации пользователя
class Authorization extends React.Component {
    state = {
        email: '', // Почта пользователя
        password: '', // Пароль пользователя
    }

    componentDidMount() {
        // Сразу переходит на поле входа
        this.toLoginField(); 
    }

    // Переход на поле входа в аккаунт
    toLoginField = () => {
        this.props.history.push({
            pathname: '/auth'
        });
    }

    // Предотвращение действия по-умолчанию при отправке формы
    onSubmitHandler = (event) => {
        event.preventDefault();
    }

    // Обработка регистрации нового аккаунта
    registerHandler = (password, email, dbErrorRef) => {
        this.setState({ password, email });

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        try {
            // Запрос на регистрацию нового аккаунта
            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPhWylwZp4YiWUbS-tTOVpxYPbR7bs9tY', authData)
                .then(res => {
                    // После успешного создания аккаунта, в нем создается новый список с инструкцией к приложению
                    axios.post(`https://notes-17db2.firebaseio.com/blocks/${res.data.localId}.json?auth=${res.data.idToken}`,
                        {
                            data: '24.08.2020',
                            list: [
                                { text: 'Нажмите на элемент списка, чобы пометить как "Выполненно"', done: false },
                                { text: 'Чтобы сохранить список, нажмите на иконку вверху справа', done: false },
                                { text: 'Чтобы удалить список, нажмите на иконку мусорной корзины вверху справа', done: false }
                            ],
                            name: 'Небольшая инструкция'
                        })
                        .then(() => this.toLoginField()); // После создания в новом аккаунте первого списка, возвращаем пользователя на страницу входа
                }).catch(() => dbErrorRef.current.style.display = 'inline-block'); // В случае ошибки, выводиться сообщение об ошибке
        } catch (e) {
            console.error(e); // Вывод в консоль ошибки, в случае неудачи при создании нового аккаунта
        }
    }

    // Обработка входа в аккаунт
    loginHandler = (password, email, errorMessageRef) => {
        const authData = {
            email, password,
            returnSecureToken: true
        };

        try {
            // Запрос на получение токенов для входа в аккаунт
            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPhWylwZp4YiWUbS-tTOVpxYPbR7bs9tY', authData)
                .then(res => {
                    // В случае успешного входа, сохранине токенов и почты в state)
                    this.props.setUser(res.data.idToken, res.data.localId, res.data.email, res.data.refreshToken);
                })
                // В случае неудачи запроса на вход, показываем сообщение об ошибке
                .catch(() => errorMessageRef.current.style.display = 'inline-block');
        } catch (e) {
            // Вывод в косноль сообщение об ошибке во время входа в аккаунт
            console.error(e);
        }
    }

    render() {
        return (
            <div className='Authorization'>
                <Switch>
                    <Route exact path='/auth' render={() => (
                        <LogIn onSubmit={this.onSubmitHandler} loginHandler={this.loginHandler} />
                    )} />
                    <Route exact path='/auth/registration' render={() => (
                        <Registration onSubmit={this.onSubmitHandler} registerHandler={this.registerHandler} />
                    )} />
                    <Route exact path='/auth/password-reset' render={() => (
                        <ResetPassword onSubmit={this.onSubmitHandler} />
                    )} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(Authorization);