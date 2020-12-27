import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-5f283.firebaseio.com/'
})

export default instance;