function food(parent, args, context) {
    return context.prisma.category.findOne({ where: { id: parent.id } }).food()
  }

  module.exports = {
      food
  }