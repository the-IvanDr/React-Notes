import React from 'react';
import './Blocks.css';
import { withRouter, Link } from 'react-router-dom';

// Компонент блока с выбором списка и кнопкой создания нового списка
function Blocks(props) {
    return (
        <div className='Blocks'>
            <ul>
                {/* Первый элемент - кнопка создания нового списка */}
                <li className='Add' onClick={props.NewList}>
                    <Link to={`/create-list`}>
                        <i className="fa fa-plus" aria-hidden="true" />
                        Создать список
                    </Link>
                </li>
                {
                    // Если нулевой список существует, значит можно выводить списки. Иначе ничего выводить не нужно (null).
                    props.blocks[0] !== null
                        ? props.blocks.map((block, index) => {
                            return (
                                // li содержит ссылку на список
                                <li key={block.id}>
                                    <Link to={`/list-${index}`}>{block.name}</Link>
                                </li>
                            );
                        })
                        : null

                }
            </ul>
        </div>
    )
}

export default withRouter(Blocks);