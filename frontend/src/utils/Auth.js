// export const BASE_URL = 'https://api.aaa.nomoredomainsicu.ru'
import { API_URL, API_OPTIONS } from './apiConfig'

function handleResponse(res) {
    if (res.ok) {
        return res.json()
    } else {
        return res.json().then((data) => {
            if (data.error) {
                return Promise.reject(`Ошибка: ${data.error}`)
            } else if (data.message) {
                return Promise.reject(`Ошибка: ${data.message}`)
            } else {
                return Promise.reject(`Ошибка: ${res}`)
            }
        })
    }
}

export function register(email, password) {
    return fetch(`${API_URL}/signup`, {
        method: 'POST',
        ...API_OPTIONS,
        body: JSON.stringify({ email, password }),
    }).then(handleResponse)
}

export function authorize(email, password) {
    return fetch(`${API_URL}/signin`, {
        method: 'POST',
        ...API_OPTIONS,
        body: JSON.stringify({ email, password }),
    }).then(handleResponse)
}

export function verifyToken() {
    return fetch(`${API_URL}/users/me`, {
        method: 'GET',
        ...API_OPTIONS,
    }).then(handleResponse)
}

export function logout() {
    return fetch(`${API_URL}/logout`, {
        method: 'GET',
        ...API_OPTIONS,
    })
}
