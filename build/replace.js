/*

dist/TextHighlighter.js
lib/index.d.ts

replace ../src/Library - ./Library
*/

const replace = require('replace-in-file');
const options = {
    files: ['./dist/TextHighlighter.js',
        './lib/*'],
    from: /\.\.\/src\/Library/g,
    to: './Library',
};

try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}