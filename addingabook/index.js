const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

const typeDefs = gql`
  type Books {
    title: String!
    published: Int!
    author: String!
    genres: [String!]
  }
  type Author {
      name: String!
      bookCount: Int!
      born: Int
  }
  type Query {
    allBooks(author: String, genre: String): [Books]!
    allAuthors: [Author]!
  }
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]
    ): Books
}
`

const resolvers = {
    Query: {
        allBooks: (root, args) => {
            if (!(args.author || args.genre))
                return books
            else if (args.author && args.genre) {
                const author = authors.find(a => a.name === args.author)
                if (!author)
                    return author
                let booksByAuthor = books.filter(b => {
                    if (b.author === author.name)
                        return b
                })
                const booksByGenre = booksByAuthor.filter(b => b.genres.includes(args.genre))
                return booksByGenre
            }
            else if (args.author) {
                const author = authors.find(a => a.name === args.author)
                if (!author)
                    return author
                let booksByAuthor = books.filter(b => {
                    if (b.author === author.name)
                        return { title: b.title }
                })
                return booksByAuthor
            }
            else if (args.genre) {
                const booksByGenre = books.filter(b => b.genres.includes(args.genre))
                return booksByGenre
            }
            return null
        },
        allAuthors: () => {
            const AuthorsCount = authors.map(a => {
                const booksArray = books.filter(b => b.author === a.name)
                const count = booksArray.length
                a = { ...a, bookCount: count }
                return a
            })
            return AuthorsCount
        },
    },
    Mutation: {
        addBook: (root, args) => {
            const book = { ...args, id: uuid() }
            books = books.concat(book)
            if (!authors.find(a => a.name === args.author)) {
                const newAuthor = { name: args.author, born: null, id: uuid() }
                authors = authors.concat(newAuthor)
            }
            return book
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})