import { gql } from '@apollo/client'

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
query fetchAllBooks {
    allBooksForFrontEnd {
        title,
        published,
        author{
            name,
            born
        }
    }
}
`

export const ADD_BOOK = gql`
mutation postAddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
    )
    {
        title,
        author{
            name,
            born
        }
    }
}
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