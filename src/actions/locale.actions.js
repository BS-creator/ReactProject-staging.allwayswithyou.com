import { localeConstants } from '../constants';

export const localeActions = {
    localSet
}
 function localSet (lang) {
    return {
        type: localeConstants.SET_LOCALE,
        lang
    };
};