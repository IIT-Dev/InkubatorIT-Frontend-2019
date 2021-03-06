import { useReducer } from 'react';

import { questions } from '../data/request';

interface IAction {
  type: string;
  payload?: any;
}

interface IState {
  [key: string]: any;
}

export const reducers = (state: IState, action: IAction) => {
  if (action.type === 'RESET') return initialState();
  return { ...state, [action.type]: action.payload };
};

export const initialState = (): IState => {
  const state = {};

  questions.forEach(question => {
    state[question.id] = question.defaultValue;
  });

  return state;
};

export const useRequestReducer = () => useReducer(reducers, initialState());
