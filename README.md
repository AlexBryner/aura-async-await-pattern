# Async Await Equivalent for Aura Components

## Generators and Promises

This pattern allows you to fire off multiple async functions (like callouts) at the same time and then set the order that they will be resolved.   It does this all without the need for long promise chains, storing and checking aura attributes, or any of the other random workarounds to ensure that async work happens in the right order.

The design revolves around using a Generator *[Function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)* to maintain state and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to resolve async requests.


**Generator Functions are not supported in InternetExplorer and there is a performance hit with the associated polyfills.*


## Function*

If you are used to working with [Async Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) you will find this pattern to be very familiar.

The generator is it is returning an [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) that returns values as it is processed, which is why it is necessary to instantiate the function and then call it to start retrieving values.  This is where the promise resolver function comes in that recursively calls the generator iterable.  In the promise resolver there is a check to determine if the iterable is done and if not calls the iterable again to yield the next result.



<table border="0" style="border: none;" >
 <tr>
    <td style="border: none;"><b style="font-size:30px">Generators With Promises</b></td>
    <td style="border: none;"><b style="font-size:30px">Async Functions With Promises</b></td>
 </tr>
 <tr>
    <td style="border: none;">
        <div>promiseResolver: function ( iter, nextValue ) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (!nextValue.done) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nextValue.value.then(result => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.promiseResolver(iter, iter.next(result));</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</div>
        <div>}</div>
    </td>
    <td style="border: none;"></td>
</tr>
<tr>
    <td style="border: none;">
        <div>function resolveAfter2Seconds( ) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return new Promise(resolve => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(( ) => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolve('resolved');</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}, 2000);</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</div>
        <div>}</div>
    </td>
    <td style="border: none;">
        <div>function resolveAfter2Seconds( ) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return new Promise(resolve => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(( ) => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolve('resolved');</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}, 2000);</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</div>
        <div>}</div>
    </td>
</tr>
<tr>
    <td style="border: none;">
        <div>const generatorFunction = function*( ) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('calling');</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var result = <b>yield</b> resolveAfter2Seconds( );</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(result);</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// expected output: 'resolved'</div>
        <div>}</div>
    </td>
    <td style="border: none;">
        <div>async function asyncCall(&nbsp;) {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('calling');</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var result = <b>await</b> resolveAfter2Seconds( );</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(result);</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// expected output: 'resolved'</div>
        <div>}</div>
    </td>
 </tr>
 <tr>
    <td style="border: none;">
        <div>const iterable = generatorFunction( );</div>
        <div>promiseResolver( iterable, iterable.next( ) );</div>
    </td>
    <td style="border: none;">
        <div>asyncCall( );</div>
    </td>
 </tr>
</table>


## Aura Component - example.cmp

In the Aura Example Component there are 3 list of promises with each promise running a set timeout with different times.  For demonstration purposes the lists are rendered in order of the timeouts, reversed, and also shuffled.  This demonstrates that while the set timeouts are resolving on their own time, the generator resolves them in the order they hit the yield statements.

This means that if a short timeout is supposed to be processed after a long timeout, the generator will hold the promise resolve returned from the short timeout until after the longer one comes around, and then they will both seemingly be processed at the same time.  I added in the last timeout from within the generator to showcase how much easier it can be to manage chaining async work with this pattern.

![](demo.gif)
