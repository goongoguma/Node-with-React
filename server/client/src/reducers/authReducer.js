import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
  switch(action.type) {
    case FETCH_USER:
      // action.payload will be either an object or empty string
      return action.payload || false;
    default: 
      return state;
  }
}