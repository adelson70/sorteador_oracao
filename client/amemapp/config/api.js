import axios from 'axios'
import { config } from './constants'

const API_URL = `http://${config.ip}:${config.port}`

const api = axios.create({
    baseURL: API_URL
})

export default api