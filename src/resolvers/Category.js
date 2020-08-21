const { APP_SECRET, getUserId } = require('../utils')

async function createCategory(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const category = await context.prisma.category.create({ data: { 
            description: args.description,
            name: args.name,
            profile: args.profile
         } })
    return category
    } catch (error) {
        return error
    }
  }

  async function getCategory(parent, args, context, info) {
    const where = args.filter
      ? {
        OR: [
          { name: { contains: args.filter } },
        ],
      }
      : {}
  
    const categories = await context.prisma.category.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.category.count({ where })
  
    return {
      categories,
      count,
    }
  }


module.exports = {
    createCategory,
    getCategory
}