# Async Await Equivalent for Aura Components

## Generators and Promises

Design revolves around using a [Function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to maintain state across async requests.

Generator Functions are not supported in InternetExplorer and there is a performance hit with polyfills.
