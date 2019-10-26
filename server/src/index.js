const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require('../prisma/generated/prisma-client')

const { Query, Mutation, Link, User } = require('./resolvers')

const resolvers = {
    Query,
    Mutation,
    Link,
    User
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', //defines the GraphQL schemas
    resolvers,
    context: request => { return { ...request, prisma } }
})

server.start(() => {
    console.log(`Server is running on http://localhost:4000`)
})
