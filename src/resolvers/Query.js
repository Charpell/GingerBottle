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

async function trip(parent, args, context, info) {

  const trips = await context.prisma.trip.findMany({
    where: {},
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = await context.prisma.trip.count({ where: {} })

  return {
    trips,
    count,
  }
}
  
  module.exports = {
    feed,
    trip
  }
  