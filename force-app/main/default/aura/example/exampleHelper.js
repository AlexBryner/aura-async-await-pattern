({
    getGenerator: function (cmp, helper, promises, setTo) {
        console.log('Hitting Generator : ' + setTo);
        const generatorFunc = function* () {

            let results = []
            for (let i = 0; i < promises.length; i++) {
                const res = yield promises[i];
                // console.log('Promised Result : ' + res);
                results.push(res);

                // Would not suggest setting within the loop, for demo only
                cmp.set(setTo, results);
                console.log(setTo + ' Numbers : ' + cmp.get(setTo));
            }

            // Adding One Last Yield for Demo Purposes and Setting the Numbers Again
            console.log('Running One More Ordered Promise : ' + 5);
            results.push(yield helper.asyncPromiseWrapper(helper.dummyFunction, (500 * 5)));

            cmp.set(setTo, results);
            console.log(setTo + ' Numbers : ' + cmp.get(setTo));
        }

        return generatorFunc;
    },

    // Calls and Resolves Promises Recursively, needed to manage the generator function
    promiseResolver: function (iter, nextValue) {
        if (!nextValue.done) {
            nextValue.value.then(result => {
                this.promiseResolver(iter, iter.next(result));
            })
        }
    },

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


    // Functions for demo purposes only

    getPromiseList: function (sort) {
        let promises = [];
        for (let i = 0; i < 10; i++) {
            const seconds = i * 500;
            promises.push(this.asyncPromiseWrapper(this.demoFunction, seconds));
        }

        if (sort === 'reverse') {
            promises.reverse();
        } else if (sort === 'shuffle') {
            this.shuffle(promises);
        }

        return promises;
    },

    demoFunction: function (i) {
        return '-- ' + (i / 500) + ' --';
    },

    shuffle: function (array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
});