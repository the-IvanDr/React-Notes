import React from 'react';
import './CreateNewList.css';
import axios from 'axios';
import BackArrow from './../../UI/BackArrow/BackArrow';
import DeleteButton from './../../UI/DeleteButton/DeleteButton';
import SaveButton from './../../UI/SaveButton/SaveButton';

// Компонент создания нового списка
export default class CreateNewList extends React.Component {
    state = {
        inputHeader: '', // Заголовок списка
        items: [''], // Элементы списка
        itemsAmount: 1, // Кол-во элементов в списке
        date: new Date().toLocaleDateString(), // Дата создания списка
        focusItem: null, // Элемент списка в фокусе
        focusHeader: false // Фокус на заголовке списка?
    }

    // Обработка отправки формы
    submitHandler = () => {
        // Если заголовок или первый элемент списка пуст - завершить выполнение функции
        if (this.state.inputHeader === '' || this.state.items[0] === '') return;

        // Создание тела списка 
        let list = {
            date: this.state.date, // Дата
            // Перенос данных из state в список
            list: this.state.items.map(item => {
                return {
                    text: item, // текст элемента списка
                    done: false // Флаг "Выполненно" на элементе списка (изначально false)
                }
            }),
            name: this.state.inputHeader // Заголовок списка
        };

        // Сохранение полученного списка в БД
        axios.post(`https://notes-17db2.firebaseio.com/blocks/${this.props.userId}.json?auth=${this.props.idToken}`, list)
            .then(() => this.props.toHome()); // Возвращение на главную страницу
    }

    // Обработчик заголовка (контроль input-а)
    headerChangeHandler = (event) => {
        this.setState({
            inputHeader: event.target.value,
            focusHeader: true // Если идет изменене заголовка, значит держим фокус на данном input-е
        });
    }

    // Обработчик ввода input-ов списка
    changeItemHandler = (event) => {
        const index = +event.target.dataset.index; // Индекс элемента в списке
        const value = event.target.value; // Получение значения поля ввода
        let items = this.state.items; // Получение занчение массива элементов списка из state
        items[index] = value; // Запись значения поля ввода по индексу
        this.setState({ // Сохранение новых данных в state
            items,
            focusItem: index, // Какой input держать в фокусе
            focusHeader: false // Убрать фокус с заголовка
        });
    }

    // Функция добавления нового элемента в список по нажатию клавиши Enter
    addItemHandler = (event) => {
        // Если клавиша Enter не была нажата, прекратить выполнение функции
        if (event.key !== 'Enter') return; 
        event.preventDefault(); // Предотвратить поведение по-умолчанию

        let items = this.state.items; // Получение элементов списка из state
        const itemsAmount = this.state.itemsAmount + 1; // +1 к счетчику кол-ва элементов списка
        items.push(''); // Добавить в массив элементов списка новый элемент с пустой строкой

        // Сохранение данных в state
        this.setState({
            items,
            itemsAmount, // Новое кол-во элементов в списке (+1)
            focusItem: itemsAmount - 1 // Какой элемент держать в фокусе 
        });
    }

    // Обработчик удаления элемента списка
    deleteItemHandler = (i) => {
        // Если элемент списка остался один, прекратить выполнение функции
        if (this.state.itemsAmount <= 1) return;

        let items = this.state.items; // Получение массива элементов списка из state
        let itemsAmount = this.state.itemsAmount - 1; // -1 к счетчику кол-ва элементов списка

        items.splice(i, 1); // Удаление элемента из массива по индексу

        // Сохранине новых данных в state
        this.setState({
            items, // новый массив элементов списка
            itemsAmount // новое кол-во элементов в списке
        })
    }

    render() {
        // Массив input-ов (для элементов списка)
        let inputs = []; // Изначально массив input-ов пустой.

        // Отрисовка списка input-ов (которые являются пунктами списка)
        for (let i = 0; i < this.state.itemsAmount; i++) {
            const input = (
                <li key={`${i}-${Math.random()}`}>
                    <input
                        onChange={this.changeItemHandler}
                        onKeyDown={this.addItemHandler}
                        type='text'
                        name={`item${i}`}
                        value={this.state.items[i]}
                        className='item'
                        autoComplete='off'
                        data-index={i}
                        autoFocus={this.state.focusItem === i && !this.state.focusHeader}
                        spellCheck={false}
                    />
                    {/* Не рендерить кнопку удаления элемента, если элемент остался один */}
                    {this.state.itemsAmount <= 1 ? null : <DeleteButton onClick={this.deleteItemHandler.bind(this, i)} />}
                </li>
            );

            inputs.push(input); // Добавление в массив input-ов очередной input
        }

        return (
            <div className='CreateNewList'>
                <BackArrow onClick={this.props.toHome} />
                <SaveButton onClick={this.submitHandler} />
                <form>
                    <input
                        onChange={this.headerChangeHandler}
                        onKeyDown={(event) => {if(event.key === 'Enter') event.preventDefault();}}
                        type='text'
                        name='header'
                        value={this.state.inputHeader}
                        placeholder='Заголовок списка...'
                        className='header'
                        autoFocus={this.state.focusHeader}
                        maxLength='20'
                    />
                    <ul>
                        {inputs}
                    </ul>
                </form>
            </div>
        )
    }
}