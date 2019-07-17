requirejs.config({
    paths: {
        jquery: 'jquery-2.1.1.min'
    }
});

requirejs(['jquery','backtop'], function ($, backtop) {
    $('#backTop').backtop({
      mode: 'move'
    });
});
