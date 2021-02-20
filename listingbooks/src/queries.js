import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query fetchAllAuthors{
  allAuthors  {
    name,
    bookCount,
    born,
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
        author,
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