import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Функция проверки почты на валидность
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Компонент входа в аккаунт
export class LogIn extends React.Component {
    state = {
        email: '',
        password: ''
    }

    // Ссылка на элементы сообщающие об ошибке
    errorMessageRef = React.createRef(); 
    emailInputRef = React.createRef();
    passwordInputRef = React.createRef();

    // Валидация введенных данных
    validation = () => {
        const { email, password } = this.state;
        let emailError = false; // Переменная для хранения результата валидации почты
        let passwordError = false; // Переменная для результата валидации пароля
        let isValid = true; // Общая валидность формы. Изначально true

        emailError = validateEmail(email); // Проверка почты на валидность
        isValid = emailError && isValid; // Проверка общей валидности формы
        if (!emailError) this.emailInputRef.current.style.display = 'inline-block'; // Показ сообщения о неверно введенной почте

        passwordError = password.length >= 6; // Проверка пароля на валидность
        isValid = passwordError && isValid; // Проверка общей валидности формы
        if (!passwordError) this.passwordInputRef.current.style.display = 'inline-block'; // Показ сообщения о некорректности введенного пароля

        // Если форма заполненна правильно
        if (isValid) {
            // Выволнение входа в аккаунт
            this.props.loginHandler(password, email, this.errorMessageRef);
        }
    }

    // Сохранение введенных в input данных в state
    onChangeHandler = (value, controlName) => {
        this.errorMessageRef.current.style.display = 'none'; // Во время ввода, скрыть сообщение об ошибке
        switch (controlName) {
            case 'email':
                this.setState({ email: value }); // Сохранить значение input в состояние (почта)
                this.emailInputRef.current.style.display = 'none'; // Скрыть сообщение об ошибке почты
                break;
            case 'password':
                this.setState({ password: value }); // Сохранить значение input в состояние (пароль)
                this.passwordInputRef.current.style.display = 'none'; // Скрыть сообщение об ошибке пароля
                break;

            default: return;
        }
    }

    render() {
        return (
            <div className='LogIn'>
                <h3>Вход</h3>
                <form onSubmit={this.props.onSubmit}>
                    <label className='email'>
                        <span ref={this.errorMessageRef}>Неверный логин или пароль</span>
                        Электронная почта: <span ref={this.emailInputRef}>Введите корректный адрес электронной почты</span>
                        <input onChange={(event) => this.onChangeHandler(event.target.value, 'email')} value={this.state.email} placeholder='E-mail...' type='email' name='email' required />
                    </label>
                    <label className='password'>
                        Пароль: <span ref={this.passwordInputRef}>Пароль должен состоять минимум из 6 символов</span>
                        <input onChange={(event) => this.onChangeHandler(event.target.value, 'password')} value={this.state.password} placeholder='Password...' type='password' name='password' required />
                    </label>
                    <input type='submit' value='Войти' onClick={this.validation} />
                    <Link to='/auth/registration'>Регистрация</Link>
                    <Link className='password-reset' to='/auth/password-reset'>Забыл пароль</Link>
                </form>
            </div>
        );
    }
}

// Компонент регистрации нового аккаунта
export class Registration extends React.Component {
    state = {
        email: '', // почта
        password1: '', // пароль
        password2: '', // повторить пароль
    }

    // Реакт ссылки на сообщения об ошибках
    emailInputRef = React.createRef();
    password1InputRef = React.createRef();
    password2InputRef = React.createRef();
    dbErrorRef = React.createRef();

    // Валидация формы
    validation = () => {
        const { email, password1, password2 } = this.state;
        let isValid = true; // Переменная для значения общей валидации формы (изначально true)
        let emailError = false; // Переменная для результата валидации почты
        let password1Error = false; // Переменная для результата валидации первого пароля (длинны)
        let password2Error = false; // Переменная для результата валидации второго пароля (на совпадение с первым)

        isValid = emailError = validateEmail(email) && isValid; // Проверка валидности почты
        if (!emailError) this.emailInputRef.current.style.display = 'inline-block'; // Показ ошибки валидации почты

        password1Error = password1.length >= 6; // Проверка валидности пароля (длины)
        isValid = password1Error && isValid; // Проверка общей валидности
        if (!password1Error) this.password1InputRef.current.style.display = 'inline-block'; // Показ сообщения об ошибке валидации пароля (длина)

        password2Error = password1 === password2; // Проверка валидности пароля (на совпадение)
        isValid = password2Error && isValid; // Проверка общей валидности
        if (!password2Error) this.password2InputRef.current.style.display = 'inline-block'; // Вывод сообщения о несовпадении паролей

        if (isValid) { // В случае валидности формы выполнить регистрацию нового аккаунта
            this.props.registerHandler(password1, email, this.dbErrorRef);
        }
    }

    // Сохранение значений input в state (Контроль input-ов)
    onChangeHandler = (value, controlName) => {
        switch (controlName) {
            case 'email':
                this.setState({ email: value }); // Сохранение ввода почты
                this.emailInputRef.current.style.display = 'none'; // Скрыть сообщение об ошибке почты
                this.dbErrorRef.current.style.display = 'none'; // Скрыть сообщение ошибки регистрации (если такая почта уже зарегестрирована)
                break;
            case 'password1':
                this.setState({ password1: value }); // Сохранение ввода пароля
                this.password1InputRef.current.style.display = 'none'; // Скрыть сообщение об ошибке пароля
                break;
            case 'password2':
                this.setState({ password2: value }); // Сохранение повторного ввода пароля
                this.password2InputRef.current.style.display = 'none'; // Скрыть сообщение о несовпадении паролей
                break;
            default: return;
        }
    }

    render() {
        return (
            <div className='Registration'>
                <h3>Регистрация</h3>
                <form onSubmit={this.props.onSubmit}>

                    <label className='email'>
                        <span ref={this.dbErrorRef}>Аккаунт с таким адресом электронной почты уже зарегистрирован</span>
                        Электронная почта: <span ref={this.emailInputRef}>Введите корректный адрес электронной почты</span>
                        <input onChange={event => this.onChangeHandler(event.target.value, 'email')} value={this.state.email} type='email' name='email' required />
                    </label>
                    <label className='password'>
                        Пароль: <span ref={this.password1InputRef}>Пароль должен состоять минимум из 6 символов</span>
                        <input onChange={event => this.onChangeHandler(event.target.value, 'password1')} value={this.state.password1} type='password' name='password' required />
                    </label>
                    <label className='password'>
                        Повторите пароль: <span ref={this.password2InputRef}>Пароль не совпадает!</span>
                        <input onChange={event => this.onChangeHandler(event.target.value, 'password2')} value={this.state.password2} type='password' name='password' required />
                    </label>
                    <input type='submit' value='Подтвердить' onClick={this.validation} />
                    <Link to='/auth'>Вход</Link>
                </form>
            </div>
        )
    }
}

// Компонент сброса пароля ("Забыли пароль?")
export class ResetPassword extends React.Component {
    state = {
        email: '', // Почта
        showMessage: false, // Показывать ли сообщение об отправке письма на почту пользователя 
        errorMessage: false // Показывать ли сообщение об ошибке
    }

    // Функция сброса пароля
    resetPassword = () => {
        const data = {
            requestType: 'PASSWORD_RESET',
            email: this.state.email
        }

        // Запрос на отправку письма на почту (ссылки на сброс пароля)
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDPhWylwZp4YiWUbS-tTOVpxYPbR7bs9tY', data)
            .then(() => this.setState({ showMessage: true })) // В случае успеха, показать сообщение об отправке письма на почту
            .catch(e => {
                console.error(e);
                this.setState({ errorMessage: true }); // В случае ошибки показать сообщение об ошибке
            });
    }

    // Валидация формы
    validation = () => {
        if (validateEmail(this.state.email)) { // Проверка валидности введенной почты
            this.resetPassword();
        }
    }

    // Сохранине изменений input-а в state
    inputChangeHandler = (event) => {
        this.setState({
            email: event.target.value,
            errorMessage: false // Скрыть сообщениее об ошибке
        });
    }


    render() {
        // Основной контент (поле ввода электронной почты и кнопки "Подтвердить" и "Назад")
        const inputField = (
            <>
                <form onSubmit={this.props.onSubmit}>
                    <label className='email'>
                        Электронная почта:
                        {this.state.errorMessage ? <span>Аккаунта с указанной почтой не существует</span> : null}
                        <input onChange={this.inputChangeHandler} value={this.state.email} type='email' name='email' required />
                    </label>
                    <input type='submit' value='Подтвердить' onClick={this.validation} />
                    <Link to='/auth'>Вход</Link>
                </form>
            </>
        );

        // Сообщение об отправке писмьа на указанную почту
        const message = (
            <>
                <p>На указанную почту было отправленно письмо со ссылкой для сброса пароля.</p>
                <Link to='/auth' >Назад</Link>
            </>
        );

        // Если отправка письма на почту произошла - рендерить сообщение об этом. Иначе рендерить основной контент с полем ввода
        let content = this.state.showMessage ? message : inputField;

        return (
            <div className='ResetPassword'>
                <h3>Сброс пароля</h3>
                {content}
            </div>
        )
    }
}