let yup = require('yup')
const { APP_SECRET, getUserId, accountNumber, charges, refCharge } = require('../utils')

const createWallet = {
    validationSchema: yup.object().shape({
        color: yup
          .string().trim().required(),
        name: yup
          .string().trim().required()
      }),
      resolve: async (parent, args, context, info) => {
        const userId = getUserId(context)
        // if (role !== 91) throw new Error("Permission denied")
        try {
            const wallet = await context.prisma.wallet.create({ data: { 
                currency: args.currency,
                color: args.color,
                name: args.name,
                accountNumber: accountNumber(),
                postedBy: { connect: { id: userId }}
             } })
        return {wallet}
        } catch (error) {
            return error
        }
      }
}

const updateWallet = {
    validationSchema: yup.object().shape({
        color: yup
          .string().trim(),
        name: yup
          .string().trim(),
        walletId: yup.string().required()
      }),
      resolve: async (parent, args, context, info) => {
        const userId = getUserId(context)
        // if (role !== 91) throw new Error("Permission denied")
        try {
            const wallet = await context.prisma.wallet.update({ data: {
                color: args.color,
                name: args.name
             }, where: { id: Number(args.walletId) } })
        return {wallet}
        } catch (error) {
            return error
        }
      }
}

async function getUserWallet(parent, args, context, info) {
    const userId = getUserId(context)
    const where = { postedBy: { id: userId }}
  
    const wallet = await context.prisma.wallet.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.wallet.count({ where })
  
    return {
      wallet,
      count,
    }
  }

  const walletDeposit = {
    validationSchema: yup.object().shape({
        currency: yup.mixed().oneOf(["NGN", "GHC"]),
        accountId: yup.string().trim(),
        amount: yup.number().positive("It must be positive").integer("It must be integer").max(1000000, "1,000,000 max reached"),
        reference: yup.string()
      }),
      resolve: async (parent, args, context, info)=> {
        const { userId, role } = getUserId(context)
        const user = await context.prisma.wallet({ id: args.accountId }).user()
        const walletAccount = await context.prisma.wallet({ id: args.accountId })
        // if (!user || user.id !== userId || walletAccount.currency !== args.currency) throw new Error("Permission denied")
        try {
          const result = await axios.get(`/transaction/verify/${args.reference}`)
          if (result.data.data.status !== "success") throw new Error("Verification pending")
            const wallet = await Promise.all([
                context.prisma.updateWallet({
                    data: {
                      balance: (walletAccount.balance + refCharge(result.data.data.amount))
                    },
                    where: {
                      id: args.accountId
                    }
                  }),
                context.prisma.createWalletTransaction({
                   wallet: { connect: { id: args.accountId }},
                   operation: "DEPOSIT",
                   amount: refCharge(result.data.data.amount),
                   reference: args.reference ,
                   balance: (walletAccount.balance + refCharge(result.data.data.amount))
                })
            ])
            const transaction = wallet[1]
            return {transaction}
          } catch (error) {
            return error
          }
      },
}

const walletWithdrawal = {
    validationSchema: yup.object().shape({
        currency: yup.mixed().oneOf(["NGN", "GHC"]),
        accountId: yup.string().required().trim(),
        amount: yup.number().positive("It must be positive").integer("It must be integer").max(50000, "50,000 max reached"),
        reference: yup.string().required()
      }),
      resolve: async (parent, args, context, info)=> {
        const { userId, role } = getUserId(context)
        const user = await context.prisma.wallet({ id: args.accountId }).user()
        const walletAccount = await context.prisma.wallet({ id: args.accountId })
        if (!user || user.id !== userId || walletAccount.currency !== args.currency) throw new Error("Permission denied")
        if (walletAccount.balance <= args.amount) throw new Error("Insufficient balance")
        try {
            const wallet = await Promise.all([
                context.prisma.updateWallet({
                    data: {
                      balance: (walletAccount.balance - args.amount)
                    },
                    where: {
                      id: args.accountId
                    }
                  }),
                context.prisma.createWalletTransaction({
                   wallet: { connect: { id: args.accountId }},
                   operation: "WITHDRAWAL",
                   amount: args.amount,
                   reference: args.reference ,
                   balance: (walletAccount.balance - args.amount)
                })
            ])
            const transaction = wallet[1]
            return {transaction}
          } catch (error) {
            return error
          }
      },
}

const walletTransfer = {
    validationSchema: yup.object().shape({
        currency: yup.mixed().oneOf(["NGN", "GHC"]),
        accountId: yup.string().required().trim(),
        destinationAccountId: yup.string().required().trim(),
        amount: yup.number().positive("It must be positive").integer("It must be integer").max(50000, "50,000 max reached")
      }),
      resolve: async (parent, args, context, info)=> {
        const { userId, role } = getUserId(context)
        const user = await context.prisma.wallet({ id: args.accountId }).user()
        const walletAccount = await context.prisma.wallet({ id: args.accountId })
        const destinationAccount = await context.prisma.wallet({ id: args.destinationAccountId })
        const reference = Date.now().toString()
        if (!user || user.id !== userId || walletAccount.currency !== args.currency, destinationAccount.currency !== args.currency) throw new Error("Permission denied")
        const chargeFee = charges(args.amount)
        if (walletAccount.balance <= (args.amount + chargeFee)) throw new Error("Insufficient balance")
        try {
            const wallet = await Promise.all([
                context.prisma.updateWallet({
                    data: {
                      balance: (walletAccount.balance - (args.amount+chargeFee))
                    },
                    where: {
                      id: args.accountId
                    }
                  }),
                context.prisma.createWalletTransaction({
                   wallet: { connect: { id: args.accountId }},
                   operation: "TRANSFER",
                   amount: args.amount,
                   reference: reference ,
                   balance: (walletAccount.balance - args.amount),
                   destinationAccountNumber: { connect: { id: args.destinationAccountId }}
                }),
                context.prisma.updateWallet({
                    data: {
                      balance: (destinationAccount.balance + args.amount)
                    },
                    where: {
                      id: args.destinationAccountId
                    }
                  }),
                context.prisma.createWalletTransaction({
                   wallet: { connect: { id: args.destinationAccountId }},
                   operation: "TRANSFER",
                   amount: args.amount,
                   reference: reference ,
                   balance: (destinationAccount.balance + args.amount),
                   destinationAccountNumber: { connect: { id: args.accountId }}
                })
            ])
            const account = wallet[0]
            const transaction = wallet[1]
            return {account,transaction}
          } catch (error) {
            return error
          }
      },
}

module.exports = {
    createWallet,
    updateWallet,
    getUserWallet,
    walletDeposit,
    walletWithdrawal,
    walletTransfer
}