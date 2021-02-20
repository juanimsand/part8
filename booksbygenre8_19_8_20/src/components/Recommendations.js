import React, { useState, useEffect } from 'react'
import { ME, ALL_BOOKS_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client'

const Recommendations = (props) => {
    const me = useQuery(ME)

    const [genre, setGenre] = useState('')

    const booksByGenre = useQuery(ALL_BOOKS_BY_GENRE, {
        variables: { genre }
    })
    
    let books = []
    
    useEffect(() => {
        console.log('inside useEffect')
        if (typeof (me.data) !== 'undefined') {
            console.log('me.data', me.data)
            const favoriteGenre = me.data.me.favoriteGenre
            console.log('favoriteGenre: ', favoriteGenre)
            setGenre(favoriteGenre)
        }
    }, [me.data])

    if (!props.show) {
        return null
    }

    if (booksByGenre.loading) {
        return <div>loading...</div>
    }

    books = booksByGenre.data.allBooks

    if (books.length === 0) {
        return (
            <div>
                <h2>recommendations</h2>
                <h3 style={{ fontWeight: 'normal' }}>Sorry, no books availables in your favorite genre <b>{genre}</b></h3>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>recommendations</h2>
                <h3 style={{ fontWeight: 'normal' }}>books in your favorite genre <b>{genre}</b></h3>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>
                                author
                            </th>
                            <th>
                                published
                            </th>
                        </tr>
                        {books.map(a =>
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Recommendations