import React from 'react';
import './List.css';
import BackArrow from './../../UI/BackArrow/BackArrow';
import { withRouter } from 'react-router-dom';
import RemoveList from './../../UI/RemoveList/RemoveList';

// Компонент списка
function List(props) {
    const index = +props.match.params.id; // Индекс списка относительно остальных списков (получен из url)
    const list = props.blocks[index]; // Получение списка из массива списков по индексу

    // Функция изменяет свойство done элемента списка (пометка "Выполненно")
    const changeListDone = (event, index) => {
        list.list[index].done = !list.list[index].done; // изменение поля 'done' в самом списке, чтобы потом отправить изменения на сервер       
        event.target.classList.toggle('done'); // toggleClass 'done'
    }

    const toHome = () => {        
        props.toHome(); // Вернуться на главную страницу
        props.changeData(list.id, list); // Отправить измененные данные на сервер
    }

    // Если список не существует, вернуться на главную страницу
    if (!list) {
        props.toHome();
        return null;
    }

    return (
        <div className='List'>
            <BackArrow onClick={toHome} /> 
            <RemoveList onClick={props.deleteData.bind(this, list.id)} />
            <h3>{list.name}</h3>
            <span>{list.date}</span>
            <ul>
                {
                    list.list.map((item, index) => {
                        return <li
                            key={`${item.text}-${Math.random()}`}
                            className={item.done ? 'done' : null}
                            onClick={(event)=>changeListDone(event, index)}
                        >{item.text}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default withRouter(List);