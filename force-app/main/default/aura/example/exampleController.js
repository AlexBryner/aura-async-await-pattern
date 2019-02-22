({
    doInit: function (cmp, event, helper) {

        // Generating 3 Separate Lists of Promises to ensure not resolving the same Promises in each of the generators
        const orderedPromises = helper.getPromiseList('in-order');
        const reversePromises = helper.getPromiseList('reverse');
        const shuffledPromises = helper.getPromiseList('shuffle');


        let orderedGenerator = helper.getGenerator(cmp, helper, orderedPromises, 'v.orderedCol');
        const orderedIterable = orderedGenerator();
        helper.promiseResolver(orderedIterable, orderedIterable.next());


        let reversedGenerator = helper.getGenerator(cmp, helper, reversePromises, 'v.reversedCol');
        const reversedIterable = reversedGenerator();
        helper.promiseResolver(reversedIterable, reversedIterable.next());


        let shuffledGenerator = helper.getGenerator(cmp, helper, shuffledPromises, 'v.shuffledCol');
        const shuffledIterable = shuffledGenerator();
        helper.promiseResolver(shuffledIterable, shuffledIterable.next());
    }
});