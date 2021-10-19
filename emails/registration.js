module.exports = function (email){
    return {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Account created',
        html: `
            <h1>Welcome to our shop</h1>
            <p>You have successfully created an account with email - ${email}</p>
            <hr/>
            <a href="${process.env.BASE_URL}">Courses store</a>
        `
    };
}