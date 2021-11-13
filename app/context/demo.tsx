import { createContext, useState } from 'react';

interface Props {
    children: React.ReactNode;
};

const DemoContext = createContext<{
    data: string;
    setData: Function;
}>({
    data: '',
    setData: () => undefined
});

const DemoState = ({ children }: Props) => {
    const [data, setData] = useState('hello');

    return (
        <DemoContext.Provider value={{ data, setData }}>
            {children}
        </DemoContext.Provider>
    );
};

export {
    DemoState,
    DemoContext
};