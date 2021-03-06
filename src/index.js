const { GraphQLServer, PubSub } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const yup = require('yup')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/schema/User')
const Link = require('./resolvers/schema/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/schema/Vote')
const Food = require('./resolvers/schema/Food')
const Category = require('./resolvers/schema/Category')
const Order = require('./resolvers/schema/Order')

const pubsub = new PubSub()

// 1
const typeDefs = `
type Query {
  info: String!
}
`

const yupValidation = {
  async Mutation(resolve, parent, args, context, info) {
    const mutationField = info.schema.getMutationType().getFields()[info.fieldName];
    const mutationValidationSchema = mutationField.validationSchema;
    
    if (mutationValidationSchema) {
      try {
        const values = await mutationValidationSchema.validate(args);
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          return {
            error: error.message,
          };
        } else {
          throw error;
        }
      }
    }

    return resolve(parent, args, context, info);
  }
}

// 2
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
    Food,
    Category,
    Order
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
  },
  middlewares: [yupValidation]
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
