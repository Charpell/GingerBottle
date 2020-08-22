const { APP_SECRET, getUserId } = require('../utils')

async function createFood(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const food = await context.prisma.food.create({ data: { 
            name: args.name,
            description: args.description,
            profile: args.profile,
            price: args.price,
            category: { connect: { id: Number(args.category) }},
            location: { connect: { id: Number(args.location )}},
            liters: args.liters,
            postedBy: { connect: { id: userId }}
         } })
    return food
    } catch (error) {
        return error
    }
  }

  async function getUserFood(parent, args, context, info) {
    const where = { postedBy: { id: Number(args.userId) }}
  
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

  async function getFood(parent, args, context, info) {
    const where = args
      ? {
          OR: [
            { name: { contains: args.filter } },
            { category:  { id: Number(args.category) }}
          ],
          AND: [
            { location:  { id: Number(args.location) }} 
          ]
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
    const food = await context.prisma.food.update({
      where: { id: Number(args.foodId) },
      data: { name: args.food, description: args.description, profile: args.profile, price: args.price, liters: args.liters }
    })
  
    return food
  }


module.exports = {
    createFood,
    getUserFood,
    updateFood,
    getFood
}