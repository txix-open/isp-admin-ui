import {Dispatch, SetStateAction, createContext} from 'react'
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import profileReducer from '../redusers/ProfileSlice.ts';

export interface ContextProps {
    setTheme: Dispatch<SetStateAction<'dark' | 'light' | string>>
}

export const Context = createContext<ContextProps>({
    setTheme: () => 'light'
})


const rootReducer = combineReducers({
    profileReducer
});

export const setupStore = () =>
    configureStore({
        reducer: rootReducer,
    });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
