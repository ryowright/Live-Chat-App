const http = require('./app');

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
    console.log('listening on *:8080');
});