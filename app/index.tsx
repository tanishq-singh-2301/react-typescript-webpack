import React, { FC } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './global.scss';

/** VIEWS */
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Three from "./views/Three";

/** CONTEXT */
import { DemoState } from './context/demo';

const App: FC<{}> = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/three' component={Three} />
                <Route exact path='/dashboard' component={Dashboard} />
            </Switch>
        </Router>
    )
};

ReactDOM.render(
    <React.StrictMode>
        <DemoState>
            <App />
        </DemoState>
    </React.StrictMode>,
    document.getElementById("root")
);