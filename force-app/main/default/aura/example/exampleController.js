({
    doInit: function (cmp, event, helper) {

        console.log('Setting up a generator function to handle promise resolves in order');
        let results = [];

        const generatorFunction = function* () {
            const promises = helper.getPromiseList();

            // Will Yield the Results in order of the Promise List
            for (let i = 0; i < promises.length; i++) {
                const res = yield promises[i];
                console.log('Promised Result : ' + res);
                results.push(res);
            }

            cmp.set('v.numbers', results);
            console.log('Numbers : ' + cmp.get('v.numbers'));

            // Adding One Last Yield for Demo Purposes and Setting the Numbers Again
            console.log('Running One More Promise : 5000');
            results.push(yield helper.asyncPromiseWrapper(helper.dummyFunction, 5000));

            cmp.set('v.numbers', results);
            console.log('Numbers : ' + cmp.get('v.numbers'));
        }

        // Calls the Generator Function and then uses the Promise Chain Function to resolve each promise in order
        let generatorIterable = generatorFunction();
        helper.promiseChain(helper, generatorIterable, generatorIterable.next());
    }
});