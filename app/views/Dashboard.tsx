import { FC, useContext, useEffect } from 'react';
import '../scss/dashboard.scss';
import Header from '../components/Header';
import { DemoContext } from '../context/demo';

const Dashboard: FC<{}> = () => {
    const { data, setData } = useContext(DemoContext);

    useEffect(() => {
        document.getElementById('side__bar')?.classList.remove('active');
    }, []);

    return (
        <section id='dashboard-page'>
            <Header title={'Dashboard'} imoji={'🛹'} />
            <h1 onClick={() => data === 'hello' ? setData('hi') : setData('hello')}>{data}</h1>
        </section>
    )
};

export default Dashboard;