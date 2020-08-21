const { APP_SECRET, getUserId } = require('../utils')

async function createLocation(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const location = await context.prisma.location.create({ data: { 
            country: args.country,
            city: args.city,
            currency: args.currency
         } })
    return location
    } catch (error) {
        return error
    }
  }

  async function getLocation(parent, args, context, info) {
    const where = args.filter
      ? {
        OR: [
          { city: { contains: args.filter } },
        ],
      }
      : {}
  
    const locations = await context.prisma.location.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.location.count({ where })
  
    return {
      locations,
      count,
    }
  }


module.exports = {
    createLocation,
    getLocation
}