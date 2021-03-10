module.exports = {
    entry: {
        client: './src/js/client.js'
    },
    output: {
        path:   __dirname + '/www/js/',
        filename:  '[name].js'
    }
};
