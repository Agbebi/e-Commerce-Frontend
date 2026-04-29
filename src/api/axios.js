import axios from "axios";



const baseURL = 'https://e-commerce-backend-8j28.onrender.com';

const API = axios.create({
    baseURL : baseURL,
    headers : {
        'Content-Type' : 'application/json',
    },
})


export default API