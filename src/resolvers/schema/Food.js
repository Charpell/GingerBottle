function postedBy(parent, args, context) {
    return context.prisma.food.findOne({ where: { id: parent.id } }).postedBy()
  }

  function category(parent, args, context) {
    return context.prisma.food.findOne({ where: { id: parent.id } }).category()
  }

  function location(parent, args, context) {
    return context.prisma.food.findOne({ where: { id: parent.id } }).location()
  }

  function variant(parent, args, context) {
    return context.prisma.food.findOne({ where: { id: parent.id } }).variant()
  }
  
  module.exports = {
    postedBy,
    category,
    location,
    variant
  }