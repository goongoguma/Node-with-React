import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
    // request to /api/current_user would go directly to our express backend
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data});
  };

