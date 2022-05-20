# Rapidomize client SDK for Javascript
Javascript client SDK for Rapidomize.

# Installation
rapidomize.js can be installed via npm. It is recommended to get rapidomize.js this way.

## npm
```
npm install @rapidomize/ics --save
```


# Integration
rapidomize.js can be integrated with plain JavaScript or with different module loaders. 
The examples below show how to load rapidomize.js in different systems.

## Script Tag
```
<script src="path/to/rapidomizejs/dist/rapidomize-browser.js"></script>
<script>
    rapidomize.init('APP_ID', 'TOKEN');
    ...
</script>
```

For example see [samples/web/index.html](samples/web/index.html)


## Bundlers (Webpack, Rollup, etc.)
```
import rapidomize from ' @rapidomize/ics';

rapidomize.init('APP_ID', 'TOKEN');
...

```

For example see [samples/node/test.js](samples/node/test.js)


# Building the SDK

```
npm install
npm run build
```

Build for development

```
npm install
npm run dev
```


# Status 
version 0.7.5 - 'Dugong Weasel'

# Contributions?
Contributions are highly welcome. If you're interested in contributing leave a note with your username.

# Policy for Security Disclosures
If you suspect you have uncovered a vulnerability, contact us privately, as outlined in our security policy document; we will immediately prioritize your disclosure.


# License

Apache 2.0

