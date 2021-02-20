import { gql } from '@apollo/client'

// FRAGMENTS

const BOOK_DETAILS = gql`
  fragment BookDetails on Books {
    title
    published
    genres
    id
    author{
      name
      born
    }
  }
`

// QUERIES

export const ALL_AUTHORS = gql`
query fetchAllAuthors{
  allAuthors  {
    name,
    born,
    bookCount,
  }
}
`

export const ALL_BOOKS = gql`
query fetchAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
        title,
        published,
        genres,
        author{
            name,
            born
        }
    }
}
`

export const ME = gql`
query me{
  me  {
    username,
    favoriteGenre,
  }
}
`

export const ALL_BOOKS_BY_GENRE = gql`
query fetchBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
        title,
        published,
        genres,
        author{
            name,
            born
        }
    }
}
`

// MUTATIONS

export const ADD_BOOK = gql`
mutation postAddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
    )
    {
        ...BookDetails
    }
}
${BOOK_DETAILS} 
`

export const EDIT_BORN = gql`
mutation editBorn($name: String!, $setBornTo: Int!) {
    editAuthor(
        name: $name,
        setBornTo: $setBornTo
    ){
    name,
    born,
    }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

// SUBSCRIPTIONS

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`