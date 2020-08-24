import React from 'react';
import axios from 'axios';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import './MainC.css';
import Blocks from './../Blocks/Blocks';
import List from './../List/List';
import CreateNewList from '../../contents/CreateNewList/CreateNewList';
import Loader from './../../UI/Loader/Loader';
import Authorization from './../../contents/Authorization/Authorization';
import UserMenu from './../UserMenu/UserMenu';
import ChangePassword from './../../contents/ChangePassword/ChangePassword';


class MainC extends React.Component {
    state = {
        blocks: [], // Массив списков

        // Данные сессии
        idToken: localStorage.getItem('idToken'),
        userId: localStorage.getItem('userId'),
        userEmail: localStorage.getItem('userEmail'),
        refreshToken: localStorage.getItem('refreshToken'),
    }

    componentDidMount() {
        // Если idToken определен, отправить запрос серверу на получение списков
        if (this.state.idToken) {
            this.getData();
        }
    }

    // Сохранение данных сессии, полученных при входе в аккаунт
    setUser = (idToken, userId, userEmail, refreshToken) => {
        this.setState({ idToken, userId, userEmail, refreshToken });

        localStorage.setItem('idToken', idToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('refreshToken', refreshToken);

        this.getData();
    }

    // Сохранение обновленных данных сессии (конкретно токенов)
    setToken = (idToken, refreshToken) => {
        this.setState({ idToken, refreshToken });
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Отправление get-запроса на сервер
    getData = () => {
        axios.get(`https://notes-17db2.firebaseio.com/blocks/${this.state.userId}.json?auth=${this.state.idToken}`)
            .then(res => {
                const blocks = []; // Создание изначально пустого массива для полученных списков
                if (res.data) {
                    // Перенос данных из объекта полученного от сервера в массив blocks по ключам
                    Object.keys(res.data).map((key, index) => blocks.unshift(Object.assign(res.data[key], { id: key })));
                } else {
                    // Если данных от сервера не получено, пушим в масссив block null
                    blocks.push(null);
                }
                this.setState({ blocks }); // Сохранение результата запроса
            }).catch(e => console.log(e)); // При ошибке вывести в консоль сообщение об ошибке.
    }

    // Удаление списка
    deleteData = (id) => {
        // Запрос на удаление записи из БД
        axios.delete(`https://notes-17db2.firebaseio.com/blocks/${this.state.userId}/${id}.json?auth=${this.state.idToken}`)
            .then(() => this.goHomeHandler()); // После выполнения запроса, переход на главную страницу
    }

    // Изменить данные списка
    changeData = (id, data) => {
        // Запрос на перезапись данных определенного списка (по id)
        axios.put(`https://notes-17db2.firebaseio.com/blocks/${this.state.userId}/${id}.json?auth=${this.state.idToken}`, data)
            .then(() => {
                this.getData(); // После успешного запроса, получаем измененные данные
            })
            .catch(e => console.log(e)); // В случае ошибка - вывод ошибки в косноль
    }

    // Функция перехода на главную страницу и обновление данных с сервера
    goHomeHandler = () => {
        this.props.history.push({
            pathname: '/'
        });
        this.getData();
    }

    // Функция перехода по указанному пути
    goTo = (path) => {
        this.props.history.push({
            pathname: path
        });
    }

    // Выход из аккаунта
    logOutHandler = () => {
        // Обнуление всех данных о сессии
        this.setState({
            blocks: [],
            idToken: null,
            userId: null,
            userEmail: null,
            refreshToken: null,
        });

        localStorage.clear(); // Очистка localStorage
    }

    // Изменение пароля
    changePasswordHandler = (newPassword) => {
        const data = {
            idToken: this.state.idToken,
            password: newPassword,
            returnSecureToken: true
        }

        // Отправка запроса на изменение пароля
        return axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDPhWylwZp4YiWUbS-tTOVpxYPbR7bs9tY', data)
            .then(res => this.setToken(res.data.idToken, res.data.refreshToken)); // в случае успеха сохранить новые токены в state
    }

    // Обновить устаревший токен
    refreshToken = () => {
        const data = {
            grant_type: 'refresh_token',
            refresh_token: this.state.refreshToken
        }

        // Запрос на получение нового токена
        axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyDPhWylwZp4YiWUbS-tTOVpxYPbR7bs9tY', data)
            .then(res => this.setToken(res.data.id_token, res.data.refresh_token)); // В случае успеха - перезаписать старый токен на новый
    }

    render() {
        // Контент, в случае если пользователь авторизовался
        let mainContent = (
            <>
                <UserMenu goTo={this.goTo} logOut={this.logOutHandler} userEmail={this.state.userEmail} />
                <Switch>
                    <Route exact path='/' render={() => (
                        <Blocks
                            blocks={this.state.blocks}
                        />
                    )} />

                    <Route exact path='/list-:id' render={() => (
                        <List
                            blocks={this.state.blocks}
                            toHome={this.goHomeHandler}
                            deleteData={this.deleteData}
                            changeData={this.changeData}
                        />
                    )} />

                    <Route exact path='/create-list' render={() => (
                        <CreateNewList toHome={this.goHomeHandler} userId={this.state.userId} idToken={this.state.idToken} />
                    )} />

                    <Route exact path='/change-password' render={() => (
                        <ChangePassword changePasswordHandler={this.changePasswordHandler} />
                    )} />

                    <Redirect to='/' />
                </Switch>
            </>
        );
        
        // Если массив списков пуст, значит показать анимацию загрузки
        if (!this.state.blocks.length) {
            mainContent = <Loader />;
            if (this.state.idToken) {
                this.refreshToken();
                this.getData();
            }
        }

        // Если пользователь не авторизован, выводить компонент авторизации
        if (!this.state.idToken) {
            mainContent = <Authorization setUser={this.setUser} />;
        }

        return (
            <div className='MainC'>
                {mainContent}
            </div>
        )
    }
}

export default withRouter(MainC);