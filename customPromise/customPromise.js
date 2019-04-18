function customPromise(callback) {
    var value;
    var status;
    var thenCollection = [];
    var catchCollection = [];

    this.then = function(callback) {
        var item = {callback: callback};
        var promise = new customPromise((resolve, reject) => {
            item.resolver = resolve;
            item.rejecter = reject;
        });

        thenCollection.push(item);

        return promise;
    }

    this.catch = function() {}

    function resolve(value) {
        var item;

        while(item = thenCollection.shift()) {
            var result = item.callback(value);
            
            if (result instanceof customPromise) {
                (function(item, result){
                    result
                        .then((result) => {
                            item.resolver(result);
                        })
                        .catch((result) => {
                            item.rejecter(result);
                        })
                })(item, result);
            } else {
                item.resolver(result);
            }
        }
    }

    function reject() {
        console.log('rejected');
    }

    callback(resolve, reject);
}

var resolver;
var resolver2;
var promise = new customPromise((resolve, reject) => {
    resolver = resolve;
});

promise
.then(() => {
    console.log('success callback 1');

    return new customPromise((resolve, reject) => {
        resolver2 = resolve;
    });
})
.then(() => {

    console.log('success callback 2');
})