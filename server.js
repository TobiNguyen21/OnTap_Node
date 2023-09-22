const app = require('./src/app');
require('dotenv').config();

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Server on port ${port}`);
})

// process.on('SIGINT', () => {
//     server.close(() => console.log('Exit Server Express'))
// })