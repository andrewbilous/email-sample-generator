import { useReducer } from 'react';

const initialState = {
  form: {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  },
  errors: {
    to: false,
    subject: false
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value
        }
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const useEmailForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateField = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const setErrors = (errors) => {
    dispatch({ type: 'SET_ERRORS', errors });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET' });
  };

  return {
    form: state.form,
    errors: state.errors,
    updateField,
    setErrors,
    resetForm
  };
};