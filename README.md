# react-action

This project was inspired by https://redux.js.org/recipes/reducing-boilerplate

### Usage

```javascript
import { createReducer, createAction, createApiAction } from 'react-action';

// Regular action
export const toggleSidebarAction = createAction('toggleSidebarAction')
// Api action
export const getUsersAction = createApiAction(
    'getUsersAction',
    () => ({
        callAPI: () => axios.get('/users')
    })
)
// Api action with payload
export const getUserAction = createApiAction(
    'getUserAction',
    (id) => ({
        callAPI: () => axios.get('/users', {id})
    })
)
// More example
export const updateUserAction = createApiAction(
    'updateUserAction',
    ({id, ...data}) => ({
        callAPI () => axios.put(`/users/${id}`, data)
    })
)

const initialState = {
    toggledSidebar: false,
    users: []
}

export createReducer(initialState, {
    [toggleSidebarAction]: (state) => ({
        ...state,
        toggledSidebar: !state.toggledSidebar
    }),
    [getUsersAction.success]: (state, {response}) => ({
        ...state,
        users: response.data
    }),
    [getUsersAction.failure]: (state, {error}) => ({
        ...state,
        error: error.message
    })
})

```

### [WIP] Test
