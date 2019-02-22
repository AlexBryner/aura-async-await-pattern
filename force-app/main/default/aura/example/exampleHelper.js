({
    // Calls and Resolves Promises Recursively, needed to manage the generator function
    promiseChain: function (helper, iter, nextValue) {
        console.log('Iterator - Next Value : ' + JSON.stringify(nextValue) + ' - ' + nextValue.value);
        if (!nextValue.done) {
            nextValue.value.then(result => {
                helper.promiseChain(helper, iter, iter.next(result));
            })
        }
    },



    // Functions for demo purposes only

    // Returns a Promise that resolves after the SetTimeout
    asyncPromiseWrapper: function (someFunction, waitTime) {
        return new Promise(function (resolve, reject) {
            setTimeout($A.getCallback(function () {
                console.log('Timeout : ' + waitTime);
                try {
                    const res = someFunction(waitTime);
                    resolve(res);
                } catch (err) {
                    reject(err);
                }
            }), waitTime);
        });
    },

    getPromiseList: function () {
        let promises = [];
        for (let i = 1; i < 10; i++) {
            const seconds = i * 1000;
            console.log('Adding Promise with SetTimeout for : ' + seconds);
            promises.push(this.asyncPromiseWrapper(this.dummyFunction, seconds));
        }

        // Reversing the order for demonstrating the result yield
        // showing the timeouts running out but waiting before setting results
        promises.reverse();
        return promises;
    },

    dummyFunction: function (i) {
        return 'New Number : ' + i;
    }
})