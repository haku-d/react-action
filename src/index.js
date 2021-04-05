export const createReducer = (initialState, handlers) => {
  return (state = initialState, action) => {
    const { type, ...rest } = action
    if (handlers[type] !== undefined) {
      return handlers[type](state, rest)
    }
    return state
  }
}

export const createAction = (actionName) => {
  const action = (data) => ({
    type: actionName,
    payload: data,
  })

  return Object.assign(action, {
    toString: () => actionName,
  })
}

export const createApiAction = (actionName, actionCreator) => {
  const requestType = `${actionName}.request`
  const successType = `${actionName}.success`
  const failureType = `${actionName}.failure`
  const apiAction = (payload) => ({
    ...actionCreator(payload),
    payload,
    types: [requestType, successType, failureType],
  })

  return Object.assign(apiAction, {
    request: requestType,
    success: successType,
    failure: failureType,
  })
}

export const loggerMiddleware = () => {
  return (next) => (action) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(action)
    }
    next(action)
  }
}

export const callAPIMiddleware = ({ dispatch, getState }) => {
  return (next) => async (action) => {
    const { types, callAPI, shouldCallAPI = () => true, payload = {} } = action

    if (!types) {
      // Normal action: pass it on
      return next(action)
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every((type) => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.')
    }

    if (!shouldCallAPI(getState())) {
      return
    }

    const [requestType, successType, failureType] = types

    dispatch({
      payload,
      type: requestType,
    })
    try {
      const response = await callAPI()
      dispatch({
        payload,
        response,
        type: successType,
      })
    } catch (error) {
      dispatch({
        payload,
        error,
        type: failureType,
      })
      throw error
    }
  }
}
