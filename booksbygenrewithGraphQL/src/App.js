
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient } from '@apollo/client'

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const client = useApolloClient()

    const logout = (event) => {
        event.preventDefault()
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setPage('authors')
        console.log('Logout function')
    }
    console.log('token: ', token)
        /**/
    console.log('page: ', page)

    if (!token) {
        return (
            <div>
                <div>
                    <button onClick={() => setPage('authors')}>authors</button>
                    <button onClick={() => setPage('books')}>books</button>
                    <button onClick={() => setPage('login')}>login</button>
                </div>

                <Authors
                    show={page === 'authors'}
                />

                <Books
                    show={page === 'books'}
                />

                < Login
                    setToken={setToken}
                    setPage={setPage}
                    show={page === 'login'}
                />

            </div>
        )
    }
    else {
        return (
            <div>
                <div>
                    <button onClick={() => setPage('authors')}>authors</button>
                    <button onClick={() => setPage('books')}>books</button>
                    <button onClick={() => setPage('add')}>add book</button>
                    <button onClick={() => setPage('recommendations')}>recommendations</button>
                    <button onClick={logout}>logout</button>
                </div>

                <Authors
                    show={page === 'authors'}
                />

                <Books
                    show={page === 'books'}
                />

                <NewBook
                    show={page === 'add'}
                />

                <Recommendations
                    show={page === 'recommendations'}
                />

            </div>
        )
    }
}

export default App