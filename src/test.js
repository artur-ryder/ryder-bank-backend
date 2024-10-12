const UserService = require('./database/services/User.service');

( async () => {
    const ryder = await UserService.createUser("Ryder", "AAAAAAAA")

    console.log(ryder)

    const getRyder = await UserService.getUserByName("Ryder")

    console.log(getRyder)
})()