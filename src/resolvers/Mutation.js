const {login, signup, updateUser, deleteUser} = require('./User')

  function post(parent, args, context, info) {
    const userId = getUserId(context)
  
    const newLink = context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      }
    })
    context.pubsub.publish("NEW_LINK", newLink)
  
    return newLink
  }

  function deletePost(parent, args, context, info) {
  
    const newLink = context.prisma.link.delete({
      where: { id: Number(args.id)}
    })
  
    return newLink
  }
  

  async function vote(parent, args, context, info) {
    // 1
    const userId = getUserId(context)
  
    // 2
    const vote = await context.prisma.vote.findOne({
      where: {
        linkId_userId: {
          linkId: Number(args.linkId),
          userId: userId
        }
      }
    })
  
    if (Boolean(vote)) {
      throw new Error(`Already voted for link: ${args.linkId}`)
    }
  
    // 3
    const newVote = context.prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: Number(args.linkId) } },
      }
    })
    context.pubsub.publish("NEW_VOTE", newVote)
  
    return newVote
  }


  module.exports = {
    signup,
    login,
    post,
    vote,
    deletePost,
    updateUser,
    deleteUser
  }
  