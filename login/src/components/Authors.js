import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'
import { useQuery, useMutation } from '@apollo/client'
import Select from "react-select"

const Authors = (props) => {
    const result = useQuery(ALL_AUTHORS)
    const [editAuthor] = useMutation(EDIT_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.log(error)
        }
    })
    
    const [born, setBorn] = useState('')
    const [selectedAuthor, setSelectedAuthor] = useState('')

    if (!props.show) {
        return null
    }

    if (result.loading) {
        return <div>loading...</div>
    }

    const authors = result.data.allAuthors
    const authorsOptions = authors.map(a => {
        const option = { value: a.name, label: a.name }
        return option
    })
    
    const submit = (event) => {
        event.preventDefault()
        const bornInt = Number(born)
        editAuthor({ variables: { name: selectedAuthor.value, setBornTo: bornInt } })
        setBorn('')
        setSelectedAuthor('')
    }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
          </table>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
              <div>
                  <Select
                      defaultValue={selectedAuthor}
                      value={selectedAuthor}
                      onChange={setSelectedAuthor}
                      options={authorsOptions}
                  />
              </div>
              <div>
                  born
          <input
                      value={born}
                      onChange={({ target }) => setBorn(target.value)}
                  />
              </div>
              <button type='submit'>update author</button>
          </form>

    </div>
  )
}

export default Authors
