import React, { FC } from 'react';
import '../scss/header.scss';
import { Link } from 'react-router-dom';
import SideBar from './Sidebar';

interface HeaderPrors {
    title: string;
    imoji: string;
};

const Header: FC<HeaderPrors> = (props) => {
    const dropdown__btn = () => {
        var value = document.getElementById('side__bar');
        value?.classList.contains('active') ? value.classList.remove('active') : value?.classList.add('active');
    };

    return (
        <>
            <SideBar />
            <header id='header'>
                <Link to='/' className='header__tag' style={{ cursor: 'pointer' }}><i>home</i> 🏕️</Link>
                {window.innerWidth > 600 ? <p className='header__tag' ><i>{props.title}</i> {props.imoji}</p> : null}
                <p className='header__tag' onClick={dropdown__btn} id='dropdown__btn'>/\/#!/</p>
            </header>
        </>
    );
};

export default Header;