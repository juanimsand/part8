const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./src/models/Book')
const Author = require('./src/models/Author')
const User = require('./src/models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'I_AM_THE_SECRET'

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

const MONGODB_URI = 'mongodb+srv://fullstack:fullstackopen@cluster0.lv8sg.mongodb.net/graphql?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

const initializer = async () => {

    //deleting all objects from authors and books collection
    await Author.deleteMany({})
    await Book.deleteMany({})
    await User.deleteMany({})

    console.log('Uploading initial data to database...')

    for (let i = 0; i < authors.length; i++) {
        const author = new Author(authors[i])
        await author.save()
    }

    for (let j = 0; j < books.length; j++) {
        const authorOfBook = await Author.findOne({ name: books[j].author })
        books[j].author = authorOfBook.id
        const book = new Book(books[j])
        await book.save()
    }

    console.log('Database uploaded successfully!')
    
}

const authorsFetched = async () => {
    const devuelve = await Author.find({})
    console.log('devuelve: ', devuelve)
    return devuelve
}


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
        initializer()
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const typeDefs = gql`
  type Books {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
      name: String!
      bookCount: Int!
      born: Int
  }
  type User {
      username: String!
      favoriteGenre: String!
      id: ID!
  }
  type Token {
      value: String!
  }
  type Query {
    allBooks(author: String, genre: String): [Books]!
    allAuthors: [Author]!
    allBooksForFrontEnd: [Books]!
    me: User
  }
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]
    ): Books
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
}
`

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            if (!(args.author || args.genre)) {
                console.log(await Book.find({}).populate('author'))
                return await Book.find({}).populate('author')
            }
            // from here to next double slashed line everything is related with authors, so it does not work yet
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
            //
            // the query must work with just genre argument
            else if (args.genre) {
                const books_tmp = await Book.find({}).populate('author')
                console.log('books_tmp', books_tmp)
                const booksByGenre = books_tmp.filter(b => b.genres.includes(args.genre))
                console.log('booksByGenre', booksByGenre)
                return booksByGenre
            }
            return null
        },
        allAuthors: async () => {
            const authors_tmp = await Author.find({})
            const books_tmp = await Book.find({}).populate('author')
            const AuthorsCount = authors_tmp.map(a => {
                const booksArray = books_tmp.filter(b => b.author.name === a.name)
                const count = booksArray.length
                a._doc = { ...a._doc, bookCount: count }
                return a._doc
            })
            console.log('AuthorsCount: ', AuthorsCount)
            return AuthorsCount
        },
        allBooksForFrontEnd: async () => {
            return await Book.find({}).populate('author')
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const author = await Author.findOne({ name: args.author })
            // checking author existence
            if (!author) {
                const newAuthor = new Author({ name: args.author, born: null })
                try {
                    await newAuthor.save()
                }
                catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                }
                
            }
            let book = { ...args, id: uuid() }
            const authorUploaded = await Author.findOne({ name: args.author })
            book.author = authorUploaded._id
            const books_tmp = new Book(book)
            try {
                await books_tmp.save()
            }
            catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            console.log('El supuesto Book vinculado al author: ', await Book.findOne({ title: args.title }).populate('author'))
            return await Book.findOne({ title: args.title }).populate('author')
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }
            const author = await Author.findOne({ name: args.name })
            if (!author) {
                return null
            }
            console.log(author)
            await Author.updateOne({ name: author.name }, { born: args.setBornTo })
            const updatedAuthor = await Author.findOne({ name: author.name })
            console.log(updatedAuthor)
            return updatedAuthor
        },
        createUser: async (root, args) => {
            let user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            user._doc = { ...user._doc, password: 'secreta' }
            console.log(user)
            try {
                return await user.save()
            }
            catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secreta') {
                throw new UserInputError("wrong credentials")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})