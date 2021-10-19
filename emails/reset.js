module.exports = function (email, token){
    return {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Access recovery',
        html: `
            <h1>Forgot your password?</h1>
            <p>If not, please ignore this letter.</p>
            <p>Otherwise click on the link below:</p>
            <p><a href="${process.env.BASE_URL}/auth/password/${token}">Restore access</a></p>
            <hr/>
            <a href="${process.env.BASE_URL}">Courses store</a>
        `
    };
}