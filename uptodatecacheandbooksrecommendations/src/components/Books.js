import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const generos = []
    const [filter, setFilter] = useState(null)

    if (!props.show) {
        return null
    }

    if (result.loading) {
        return <div>loading...</div>
    }
    
    let books = result.data.allBooks

    books.map(e =>
        e.genres.map(g => {
            if (!generos.includes(g))
                generos.push(g)
        })
    )

    if (filter) {
        books = books.filter(b => b.genres.includes(filter))
    }
    
        return (
            <div>
                <h2>books</h2>
                <h3 style={{ visibility: filter ? 'visible' : 'hidden', fontWeight: 'normal' }}>in genre <b>{filter}</b></h3>
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
                <div>
                    {generos.map(g =>
                        <button key={g} onClick={() => setFilter(g) }>{g}</button>)
                    }
                    <button key='allbooks' onClick={() => setFilter(null)}>all books</button>
                </div>
            </div>
        )
}

export default Books