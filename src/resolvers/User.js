const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')
let yup = require('yup')

  async function signup(parent, args, context, info) {
    // 1
    const password = await bcrypt.hash(args.password, 10)
    
    // 2
    const user = await context.prisma.user.create({ data: { ...args, password } })
  
    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 4
    return {
      token,
      user,
    }
  }
  
  async function login(parent, args, context, info) {
    // 1
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) {
      throw new Error('No such user found')
    }
  
    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
  
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 3
    return {
      token,
      user,
    }
  }

  async function getUser(parent, args, context, info) {
    const user = await context.prisma.user.findOne({
      where: { id: Number(args.userId) }
    })
  
    return user
  }

  async function updateUser(parent, args, context, info) {
    const userId = getUserId(context)
    const user = await context.prisma.user.update({
      where: { id: Number(userId) },
      data: { email: args.email }
    })
  
    return user
  }

  function deleteUser(parent, args, context, info) {
  
    const user = context.prisma.user.delete({
      where: { id: Number(args.id)}
    })
  
    return user
  }

  const updateRefferal = {
    validationSchema: yup.object().shape({
      userId: yup
        .string().required().trim()
    }),
    resolve: async (parent, args, context, info)=> {
      const userId = getUserId(context)
      try {
        const result = await Promise.all([
          context.prisma.updateUser({
            data: {
              referral: args.userId,
              hasReferral: true
            },
            where: {
              id: Number(userId)
            }
          }),
          context.prisma.updateUser({
            data: {
              referee: { connect: { id: Number(userId) }}
            },
            where: {
              id: args.userId
            }
          })
        ])
        const user = result[0]
        return {user}
      } catch (error) {
        throw new Error(error)
      }
    
    },
  }

  const updatePassword = {
    validationSchema: yup.object().shape({
      old: yup 
        .string().trim().min(1).max(30).required(),
      new: yup 
        .string().trim().min(1).max(30).required(),
    }),
    resolve: async (parent, args, context, info)=> {
      const userId = getUserId(context)
      try {
        const user = await context.prisma.user({ id: userId })
        if (!user) {
          throw new Error('No such user found')
        }
  
        const valid = await bcrypt.compare(args.old, user.password)
        if (!valid) {
          throw new Error('Invalid password')
        }
  
        const password = await bcrypt.hash(args.new, 10)
  
        await context.prisma.updateUser({
          data: {
            password: password
          },
          where: {
            id: userId
          }
        })
  
        
        return {
          user
        }
      } catch (error) {
        throw new Error(error)
      }
    
    },
  }

  module.exports = {
      signup,
      login,
      getUser,
      updateUser,
      deleteUser,
      updateRefferal,
      updatePassword
  }