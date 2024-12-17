import axios from 'axios'
import { config } from './constants'

const API_URL = config.url

const api = axios.create({
    baseURL: API_URL
})

export default api