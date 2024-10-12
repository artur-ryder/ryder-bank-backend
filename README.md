# Ryder Bank API
Ryder Bank is a bank where you can transfer and receive **FAKE** money!
A project to demonstrate my backend skills. 🚀✨

Access the application <a>COMING SOON</a>.

# Technologies

[![Technologies](https://skillicons.dev/icons?i=js,nodejs,express,mongo)](https://skillicons.dev)

# Configuration
The
`.env`
file must have these fields:
```
JWT_SECRET=(INSERT HERE)
MONGO_DB_CONNECTION_URI=(INSERT HERE)
```

# NPM commands
Start Backend
```bash
 npm start
```

Start in development mode - Using Nodemon
```bash
 npm run dev
```
# Endpoints

## /users

Get a user information. Must be logged in providing the cookie "authorization".
```js
GET /users
```
<br></br>
Create a user on database. Must provide username and password.
```js
POST /users/create

{
    "username": USERNAME, 
    "password": PASSWORD
}
```
<br></br>
Verify if the user exists on database. If yes, returns the authorization cookie. Must provide username and password.
```js
POST /users/login

{
    "username": USERNAME, 
    "password": PASSWORD
}
```
<br></br>
Delete a user. Must provide username and password.
```js
POST /users/delete

{
    "username": USERNAME, 
    "password": PASSWORD
}
```
<br></br>
## /transactions

All routes under `/transactions` require the user to be logged in.

Retrieve all transactions made by or to the logged-in user.
```js
GET /transactions
```
<br></br>
Transfer money from the user logged in to the "receiver" if "receiver" exists.
```js
POST /transactions/create

{
    "receiver": RECEIVER_USERNAME,
    "amount": QUANTITY
}
```



# Things I still want to do.
- [ ] Admin Panel
- [ ] Revert Transaction endpoint for admins
- [ ] Discord Webhooks ( Just for Fun )
