const { APP_SECRET, getUserId } = require('../utils')

async function createOrder(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const order = await context.prisma.order.create({ data: { 
            delivery: args.delivery,
            time: args.time,
            status: "UNPAID",
            postedBy: { connect: { id: userId }},
            variant: { connect: { id: Number(args.variant) }}
         } })
    return order
    } catch (error) {
        return error
    }
  }


  async function payOrder(parent, args, context, info) {
    const userId = getUserId(context)
    const order = await context.prisma.order.update({
      where: { id: Number(args.orderId) },
      data: { status: "PENDING" }
    })
  
    return order
  }

  async function orderStatus(parent, args, context, info) {
    const userId = getUserId(context)
    const order = await context.prisma.order.update({
      where: { id: Number(args.orderId) },
      data: { status: args.status }
    })
  
    return order
  }

  async function completeOrder(parent, args, context, info) {
    const userId = getUserId(context)
    const order = await context.prisma.order.update({
      where: { id: Number(args.orderId) },
      data: { status: "DELIVERED" }
    })
  
    return order
  }

  async function cancelOrder(parent, args, context, info) {
    const userId = getUserId(context)
    const order = await context.prisma.order.update({
      where: { id: Number(args.orderId) },
      data: { status: "CANCELLED" }
    })
  
    return order
  }






module.exports = {
    createOrder,
    payOrder,
    orderStatus,
    completeOrder,
    cancelOrder
}