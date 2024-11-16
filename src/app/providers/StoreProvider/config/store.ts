// import { configureStore } from '@reduxjs/toolkit';
// import { StateSchema } from './StateSchema';
// import { CounterReducer } from 'entities/Counter';
//
// export function createReduxStore(initialState?: StateSchema) {
//     return configureStore<StateSchema>({
//         reducer: {
//             counter: CounterReducer,
//         },
//         devTools: __IS_DEV__,
//         preloadedState: initialState,
//     });
// }

import { configureStore } from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';  // Note the capital S in StateSchema
import { CounterReducer } from 'entities/Counter';  // Make sure this path matches your actual structure

export function createReduxStore(initialState?: StateSchema) {
    return configureStore<StateSchema>({
        reducer: {
            counter: CounterReducer,
        },
        devTools: __IS_DEV__,
        preloadedState: initialState,
    });
}

export type { StateSchema };  // Make sure we're exporting the type
