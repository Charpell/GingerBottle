function postedBy(parent, args, context) {
    return context.prisma.order.findOne({ where: { id: parent.id } }).postedBy()
  }

  function variant(parent, args, context) {
    return context.prisma.order.findOne({ where: { id: parent.id } }).variant()
  }

  
  module.exports = {
    postedBy,
    variant
  }