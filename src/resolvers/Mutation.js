function feed(parent, args, context, info) {
    return context.prisma.link.findMany()
  }
  
  module.exports = {
    feed,
  }
  This is pretty straighforward. You’re just reimplementing the same functionality from before with a dedicated function in a different file. The Mutation resolvers are next.
  
  Adding authentication resolvers
  Open Mutation.js and add the new login and signup resolvers (you’ll add the post resolver in a bit):
  
  .../hackernews-node/src/resolvers/Mutation.js
  async function signup(parent, args, context, info) {
    // 1
    const password = await bcrypt.hash(args.password, 10)
    
    // 2
    const user = await context.prisma.user.create({ data: { ...args, password } })
  
    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 4
    return {
      token,
      user,
    }
  }
  
  async function login(parent, args, context, info) {
    // 1
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) {
      throw new Error('No such user found')
    }
  
    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
  
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 3
    return {
      token,
      user,
    }
  }
  
  module.exports = {
    signup,
    login,
    post,
  }
  