const { GraphQLServer, PubSub } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/schema/User')
const Link = require('./resolvers/schema/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/schema/Vote')

const pubsub = new PubSub()

// 1
const typeDefs = `
type Query {
  info: String!
}
`

// 2
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
  }

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
      return {
          ...request,
          prisma,
          pubsub
        }
  }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
