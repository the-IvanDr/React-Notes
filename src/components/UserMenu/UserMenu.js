import React from 'react';
import './UserMenu.css';


// Компонент меню пользователя
export default class UserMenu extends React.Component {
    state = {
        toggle: true // Состояния меню (открыто/закрыто)
    }

    ExitButtonRef = React.createRef(); // React Ref на кнопку 'Выйти'
    ChangePasswordButtonRef = React.createRef(); // React Ref на кнопку 'Изменить пароль'

    // Функция плавного закрытия/открытия меню
    toggleMenu = () => {
        if (this.state.toggle) {
            this.ExitButtonRef.current.style.display = 'inline-block';
            this.ChangePasswordButtonRef.current.style.display = 'inline-block';

            setTimeout(() => {
                this.ExitButtonRef.current.style.opacity = '.5';
                this.ExitButtonRef.current.style.marginLeft = '0';

                this.ChangePasswordButtonRef.current.style.opacity = '.5';
                this.ChangePasswordButtonRef.current.style.marginLeft = '0';
            }, 100);

        } else {
            this.ExitButtonRef.current.style.marginLeft = '-50px';
            this.ExitButtonRef.current.style.opacity = '0';

            this.ChangePasswordButtonRef.current.style.marginLeft = '-50px';
            this.ChangePasswordButtonRef.current.style.opacity = '0';


            setTimeout(() => {
                this.ExitButtonRef.current.style.display = 'none';
                this.ChangePasswordButtonRef.current.style.display = 'none';
            }, 300);
        }


        this.setState({ toggle: !this.state.toggle });
    }

    render() {
        // Массив классов для открытого или закрытого меню
        let classes = [this.state.toggle ? 'userMenuActive' : null];

        return (
            <div className='UserMenu'>
                <button onClick={this.toggleMenu}>{this.props.userEmail}</button>
                <ul>
                    <button onClick={this.props.logOut} className={classes} ref={this.ExitButtonRef}>Выйти</button>
                    <button onClick={()=>this.props.goTo('/change-password')} className={classes} ref={this.ChangePasswordButtonRef}>Изменить пароль</button>
                </ul>
            </div>
        )
    }
}