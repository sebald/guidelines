var ScrollRack = require('scroll-rack');

ScrollRack({
    files: 'docs/',
    dest: 'build',
    nav: {
        order: ['typescript', 'angular', 'coding']
    }
});