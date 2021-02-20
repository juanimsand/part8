import React, { useState } from 'react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, ALL_BOOKS_BY_GENRE, ME } from '../queries'
import { useMutation, useQuery } from '@apollo/client'


const NewBook = (props) => {
    
    const me = useQuery(ME)

    const [addBook] = useMutation(ADD_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
        onError: (error) => {
            console.log(error)
        },
        update: (store, response) => {
            const dataInStore = store.readQuery({ query: ALL_BOOKS_BY_GENRE, variables: { genre: me.data.me.favoriteGenre} })
                store.writeQuery({
                    query: ALL_BOOKS_BY_GENRE,
                    variables: {genre: me.data.me.favoriteGenre},
                    data: {
                        ...dataInStore,
                        allBooks: [...dataInStore.allBooks, response.data.addBook]
                    }
            })
            props.updateCacheWith(response.data.addBook)
        }
    })

  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!props.show) {
    return null
  }

const submit = async (event) => {
    event.preventDefault()

    const publishedInt = Number(published)
    addBook({ variables: { title, author, published: publishedInt, genres } })
      
    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook