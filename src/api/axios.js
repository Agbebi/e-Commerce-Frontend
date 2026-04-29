import axios from "axios";



const baseURL = 'https://e-commerce-backend-8j28.onrender.com';
const localUrl = 'http://localhost:3000'

const API = axios.create({
    baseURL : baseURL || localUrl,
    headers : {
        'Content-Type' : 'application/json',
    },
})


export default API