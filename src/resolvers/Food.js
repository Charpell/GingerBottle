const { APP_SECRET, getUserId } = require('../utils')

async function createFood(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const food = await context.prisma.user.create({ data: { 
            name: args.name,
            description: args.description,
            profile: args.profile,
            profiles: args.profiles,
            price: args.price,
            category: { connect: { id: args.category }},
            liters: args.liters,
            postedBy: { connect: { id: userId }}
         } })
    return food
    } catch (error) {
        return error
    }
  }

  async function getUserFood(parent, args, context, info) {
    const where = args.filter
      ? {
        OR: [
          { postedBy: { id: args.userId }}
        ],
      }
      : {}
  
    const food = await context.prisma.food.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.food.count({ where })
  
    return {
      food,
      count,
    }
  }

  async function updateFood(parent, args, context, info) {
    const userId = getUserId(context)
    const food = await context.prisma.user.update({
      where: { id: Number(args.foodId) },
      data: { description: args.description, profile: args.profile, profiles: args.profiles, price: args.price, liters: args.liters }
    })
  
    return food
  }


module.exports = {
    createFood,
    getUserFood,
    updateFood
}