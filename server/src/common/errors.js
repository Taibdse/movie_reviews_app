

const commentErrors = {
    content: 'Content is required and minlength is 5, maxlength is 10000 characters',
    notfound: 'Comment not found',
    reaction_type:'Invalid type of reaction to this comment!'
}

const movieErrors = {
    notfound: 'Movie not found'
}

const userErrors = {
    email: 'Email is not valid',
    password: 'Password is required and minlength must be 4 characters',
    user_notfound: 'User not found',
    invalid_login: 'User and password do not match',
    email_existed: 'This email is existed in the system',
    rate: 'Vote must be 1 to 10 stars and must be integer'
}

module.exports = { commentErrors, userErrors, movieErrors };