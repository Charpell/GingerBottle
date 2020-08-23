const {getUser} = require('./User')
const {getCategory} = require('./Category')
const {getLocation} = require('./Location')
const {getUserFood, getFood} = require('./Food')
const {getUserWallet} = require('./Wallet')


async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } },
      ],
    }
    : {}

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = await context.prisma.link.count({ where })

  return {
    links,
    count,
  }
}



  
  module.exports = {
    feed,
    getUser,
    getCategory,
    getLocation,
    getUserFood,
    getFood,
    getUserWallet
  }
  