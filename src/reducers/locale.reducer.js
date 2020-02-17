import { localeConstants } from '../constants';

const lang = localStorage.getItem('lang');
const initialState = { lang: lang ? lang : 'en-US' };

export function localeReducer(state = initialState, action) {
    switch(action.type){
        case localeConstants.SET_LOCALE:
            localStorage.setItem('lang', action.lang);
            console.log(localStorage.getItem('lang'))
            

            return{
                ...state,
                lang: action.lang
            }
        default: return state;
    }
}