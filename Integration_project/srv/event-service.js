module.exports = function () {

    this.on('login', async (req) => {
        const { email, password } = req.data;

        if (!email || !password) {
            return req.error(400, 'Email and password are required.');
        }

        const { Users } = cds.entities('eventmanager');
        const user = await cds.run(
            SELECT.one.from(Users).where({ email })
        );

        if (!user || user.password !== password) {
            return req.error(403, 'Invalid email or password.');
        }

        delete user.password;
        return user;
    });
};
