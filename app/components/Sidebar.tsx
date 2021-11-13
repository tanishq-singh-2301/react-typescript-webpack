import { useEffect, FC } from 'react';
import '../scss/sidebar.scss';
import { Link } from 'react-router-dom';

const SideBar: FC<{}> = () => {
    const links: string[][] = [['/', 'home 🏕️'], ['/three', 'three 🐽'], ['/dashboard', 'dashboard 🛹']];

    useEffect(() => {
        window.onload = () => {
            var value = document.getElementById('side__bar');
            value?.classList.contains('active') ? value.classList.remove('active') : null;
        };
    }, []);

    const dropdown__btn = () => {
        var value = document.getElementById('side__bar');
        value?.classList.contains('active') ? value.classList.remove('active') : value?.classList.add('active');
    };

    return (
        <nav id='side__bar' className='active'>
            <h1 id='links__name'> some links 🕸️</h1>
            <div id='links__div'>
                {
                    links.map((res, index) => {
                        return (
                            <div className='link' onClick={dropdown__btn} key={index}>
                                <p className='plus__tag'> + </p>
                                <Link to={res[0]} className='links'> {res[1]} </Link>
                            </div>
                        )
                    })
                }
            </div>
        </nav>
    );
};

export default SideBar;