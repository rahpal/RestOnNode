// HTTP message handler Interface.

var messageHandler = (function() {
    "use strict";

    var _delegationHandler = function(name){ 
        this.handlerName = name;
    };

    _delegationHandler.prototype.handleRequest = function() {
        /* Your implementation goes here. */
    };

    _delegationHandler.prototype.handleResponse = function() {
        /* Your implementation goes here. */
    };

    return _delegationHandler;

})();

module.exports = messageHandler;