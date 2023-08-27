export const BASE_URL = 'https://api.aaa.nomoredomainsicu.ru'

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
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then(handleResponse)
}

export function authorize(email, password) {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then(handleResponse)
}

export function checkToken() {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse)
}

export function logOut() {
    return this._request('logout', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })
}
