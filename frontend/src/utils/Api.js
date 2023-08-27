class Api {
    constructor(data) {
        this._baseUrl = data.baseUrl
        this._headers = data.headers
    }

    _checkResponse(res) {
        return res.ok
            ? res.json()
            : Promise.reject(`Ошибка получения данных: ${res.status}`)
    }

    getInitialsCards() {
        return fetch(`${this._baseUrl}/cards`, {
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse)
    }

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse)
    }

    setUserInfo(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about,
            }),
        }).then(this._checkResponse)
    }

    setAvatar(link) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                avatar: link.avatar,
            }),
        }).then(this._checkResponse)
    }

    addCard(card) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: card.title,
                link: card.link,
            }),
        }).then(this._checkResponse)
    }

    deleteCard(cardID) {
        return fetch(`${this._baseUrl}/cards/${cardID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse)
    }

    setLike(cardID) {
        return fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
            method: 'PUT',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse)
    }

    deleteLike(cardID) {
        return fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse)
    }

    changeLikeCardStatus(cardID, isLiked) {
        return isLiked ? this.deleteLike(cardID) : this.setLike(cardID)
    }
}

const api = new Api({
    baseUrl: 'https://api.aaa.nomoredomainsicu.ru',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
