exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",
    capabilities: {
        browserName: "chrome"
    },
    specs: ["*_spec.js"],
    baseUrl: 'http://localhost:9002/',
    jasmineNodeOpts: {
        showColors: true
    }
}