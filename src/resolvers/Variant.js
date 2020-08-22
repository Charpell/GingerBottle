const { APP_SECRET, getUserId } = require('../utils')

async function createVariant(parent, args, context, info) {
    const userId = getUserId(context)
    // if (role !== 91) throw new Error("Permission denied")
    try {
        const variant = await context.prisma.variant.create({ data: { 
            name: args.name,
            description: args.description,
            profile: args.profile,
            liters: args.liters,
            price: args.price,
            video: args.video,
            food: { connect: { id: Number(args.foodId) }}
         } })
    return variant
    } catch (error) {
        return error
    }
  }


  async function updateVariant(parent, args, context, info) {
    const userId = getUserId(context)
    const food = await context.prisma.variant.update({
      where: { id: Number(args.variantId) },
      data: { name: args.name, description: args.description, profile: args.profile, price: args.price, video: args.video }
    })
  
    return food
  }

  function deleteVariant(parent, args, context, info) {
    const userId = getUserId(context)
    const variant = context.prisma.variant.delete({
      where: { id: Number(args.id)}
    })
  
    return variant
  }


module.exports = {
    createVariant,
    updateVariant,
    deleteVariant
}