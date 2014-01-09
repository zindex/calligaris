$(function(){
    var debug = new HtmlDebugger();
});


function HtmlDebugger(){
    var self = this,
        htmlBody = '<div id="html-debugger-wrapper" class="html-state-switcher" style="position:fixed; top:100px; right:20px; z-index:1001; background:#fff; border:1px solid #ff0000;"></div>',
        itemsCollection = $('*[data-htmlstate]'),
        states = [],
        item = {};

    this.init = function(){
        $('body').append(htmlBody);
        var wrapper = $('#html-debugger-wrapper');

        itemsCollection.each(function(){
            itemsCollection.add($(this));
            var tempState = $(this).attr('data-htmlstate').split(' ');
            for (var i = 0; i < tempState.length; i++){
                if ($.inArray(tempState[i], states) === -1) {
                    states.push(tempState[i]);
                }
            }

        });

        //adding states controls
        for (var i = 0; i < states.length; i++){
            var template = '<div class="html-state-switcher__item" style="padding:10px;"><label><input data-htmlstate="'+ states[i] +'" name="html-debug" type="radio" style="margin-right:10px;">'+ states[i] +'</label></div>';
            wrapper.append(template);
        }

        //adding handlers
        var inputs = $('.html-state-switcher input'),
            labels = $('.html-state-switcher label');

        inputs.on({
            click: function(e){
                var input = $(this);

                //on check
                //inputs.prop('checked', 'checked');
                //input.prop('checked', 'checked');

                itemsCollection.hide();
                itemsCollection.filter(function(index){
                    var nameArr = $(this).attr('data-htmlstate').split(' ');

                    return nameArr.indexOf(input.attr('data-htmlstate')) != -1 && $(this)
                }).show();

                e.preventDefault();
            }
        });

        if (inputs.length === 0){
            wrapper.remove();
        }
    };

    this.init();
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;

        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}