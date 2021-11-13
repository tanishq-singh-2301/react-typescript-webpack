import { FC, useEffect } from "react";
import '../scss/home.scss';
import Header from '../components/Header';

const Home: FC<{}> = () => {
    useEffect(() => {
        document.getElementById('side__bar')?.classList.remove('active');
    }, []);

    return (
        <section id='home-page'>
            <Header title={'react typescript webpack'} imoji={'👻'} />
            <h1 id='greeting' onClick={() => window.open('https://tanishq-singh.herokuapp.com', '_blank')} >made by tanishq singh 🤖</h1>
        </section>
    )
};

export default Home;