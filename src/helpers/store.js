import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

const middleware = [
    thunkMiddleware,
    process.env.NODE_ENV === 'development' && loggerMiddleware
].filter(Boolean);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    rootReducer,
    composeEnhancers(
    applyMiddleware(
        ...middleware
    )
));
