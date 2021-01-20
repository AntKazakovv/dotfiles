module.exports = {
    ident: 'embedded',
    sourceMap: 'inline',
    plugins: [
        require('css-mqpacker')({sort: true}),
    ],
};
