const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
    const userId = getUserId(context)

    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
    })
}

async function signup(parent, args, context, info) {

    const { name, email } = args

    const password = await bcrypt.hash(args.password, 10)

    const user = await context.prisma.createUser({
        name,
        email,
        password
    })


    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }

}

async function login(parent, args, context, info) {
    const user = context.prisma.user({ email: args.email });

    if (!user) {
        throw new Error("No user found!")
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

module.exports = {
    signup,
    login,
    post
}