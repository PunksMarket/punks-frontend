/* **************** ROUTE CONSTANT START ************************** */
export const COLLECTIONS = '/';
export const MY_COLLECTIONS = '/my-collections';
export const COLLECTION = '/collection/:id/:mode';
export const NEW_CARD = '/new-card';
export const MY_PURCHASED_CARDS = '/my-cards';
export const TRANSACTIONS = '/transactions';


/* **************** ROUTE CONSTANT START ************************** */
export const API = {
    COLLECTIONS_ALL_get: '/collection/all',
    MY_COLLECTIONS_get: '/collection/read',
    NEW_COLLECTION_post: '/collection/create',
    RENAME_COLLECTION_post: '/collection/rename',
    TRANSACTIONS_get: '/transaction/retrieve',
    TRANSACTIONS_CREATE_post: '/transaction/create',
    MY_CARDS_get: '/card/my-cards',
    COLLECTION: '/card/collectionId',
};


export const CURRENCY = '$';
export const COLLECTION_MODE = {
    ALL: 'all',
    GENERAL: 'general'
};
