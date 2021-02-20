
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import { useApolloClient, useSubscription } from '@apollo/client'

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const client = useApolloClient()

    const updateCacheWith = (addedBook) => {
        const includedIn = (set, object) => {
            console.log(object.id)
            set.map(b => b.id).includes(object.id)
            console.log('set.map(b => b.id).includes(object.id): ', set.map(b => b.id).includes(object.id))
        }
        const dataInStore = client.readQuery({ query: ALL_BOOKS })
        if (!includedIn(dataInStore.allBooks, addedBook)) {
            client.writeQuery({
                query: ALL_BOOKS,
                data: { allBooks: dataInStore.allBooks.concat(addedBook) }
            })
        }
    }
    
    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            console.log(subscriptionData)
            const addedBook = subscriptionData.data.bookAdded
            window.alert(`${addedBook.title} added`)
            updateCacheWith(addedBook)
        }
    })

    const logout = (event) => {
        event.preventDefault()
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setPage('authors')
        console.log('Logout function')
    }


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
                    updateCacheWith={updateCacheWith}
                />

                <Recommendations
                    show={page === 'recommendations'}
                />

            </div>
        )
    }
}

export default App