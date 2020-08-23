const {login, signup, updateUser, deleteUser, updateRefferal, updatePassword} = require('./User')
const {createFood, updateFood} = require('./Food')
const {createCategory} = require('./Category')
const {createLocation} = require('./Location')
const {createVariant, updateVariant, deleteVariant} = require('./Variant')
const {createOrder, payOrder, orderStatus, completeOrder, cancelOrder} = require('./Order')
const {createWallet, updateWallet, walletDeposit, walletWithdrawal, walletTransfer} = require('./Wallet')

const { APP_SECRET, getUserId } = require('../utils')

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
    deleteUser,
    createFood,
    createCategory,
    createLocation,
    updateFood,
    createVariant,
    updateVariant,
    deleteVariant,
    createOrder,
    orderStatus,
    payOrder,
    completeOrder,
    cancelOrder,
    createWallet,
    updateWallet,
    walletDeposit,
    walletWithdrawal,
    walletTransfer,
    updateRefferal,
    updatePassword
  }
  