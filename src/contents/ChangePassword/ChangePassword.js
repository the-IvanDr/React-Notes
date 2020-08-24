import React from 'react';
import './ChangePassword.css';
import { Link } from 'react-router-dom';

export default class ChangePassword extends React.Component {

    state = {
        password1: '', // пароль
        password2: '', // подвердить пароль 
        password1Error: false, // Показывать ли сообщение об ошибке первого пароля
        password2Error: false, // Показывать ли сообщение об ошибке второго пароля
        isPasswordChanged: false // Показывать ли сообщение об успешном изменении пароля
    }

    // Обработка отправки формы
    onSubmitHandler = (ev) => {
        ev.preventDefault(); // Предотвращение действия по-умолчанию
        if (this.validate()) { // Если данные валидны
            this.props.changePasswordHandler(this.state.password1) // Сменить пароль
                .then(() => this.setState({ isPasswordChanged: true })) // В случае успеха - показать сообщение об успехе
                .catch((error) => console.error(error)); // В случае ошибки, вывести ее в консоль
        }
    }

    // Валидация формы
    validate = () => {
        const { password1, password2 } = this.state;
        let isValid = true; // Общая валидность формы

        const lengthValid = password1.length >= 6; // Валидация пароля (на длину)
        isValid = lengthValid; // Изменение валидности всей формы

        const equalValid = password1 === password2; // Проверка на совпадение паролей
        isValid = equalValid && isValid; // Изменение общей валидности формы

        if (!lengthValid) { // Если неверная длина пароля
            this.setState({ password1Error: true }); // Показать сообщение об ошибке
        }

        if (!equalValid) { // Если пароли не совпадают
            this.setState({ password2Error: true }); // Показать сообщение об ошибке
        }

        return isValid; // Вернуть общий результат валидации формы
    }

    // Сохранение значений input в state
    onChangeHandler = ({ target }, componentName) => {
        switch (componentName) {
            case 'password1':
                // Сохранить ввод первого пароля и скрыть сообщение об ошибке (длина пароля)
                this.setState({ password1: target.value, password1Error: false });
                break;
            case 'password2':
                // Сохранить ввод второго пароля и скрыть сообщение об ошибке (совпадение паролей)
                this.setState({ password2: target.value, password2Error: false });
                break;
            default: return;
        }
    }

    render() {
        // Основной контент - форма ввода
        const form = (
            <form onSubmit={this.onSubmitHandler}>

                <label className='password'>
                    Пароль:
                        {this.state.password1Error ? <span>Пароль должен состоять минимум из 6 символов</span> : null}
                    <input onChange={(ev) => this.onChangeHandler(ev, 'password1')} value={this.state.password1} type='password' name='password' required />
                </label>
                <label className='password'>
                    Повторите пароль:
                        {this.state.password2Error ? <span>Пароли не совпадают</span> : null}
                    <input onChange={(ev) => this.onChangeHandler(ev, 'password2')} value={this.state.password2} type='password' name='password' required />
                </label>

                <input type='submit' value='Подтвердить' />
                <Link to='/'>Назад</Link>
            </form>
        );

        // Сообщение об успехе
        const successMessage = (
            <>
                <p>Пароль успешно изменен!</p>
                <Link to='/'>Вернуться назад</Link>
            </>
        )

        // Рендер сообщения об успехе или формы ввода
        const content = this.state.isPasswordChanged ? successMessage : form;

        return (
            <div className='ChangePassword'>
                <h3>Изменить пароль: </h3>
                {content}
            </div>
        )
    }
}