const vm = require('vm');

const script = `
  var window = {};
  var dataLayer = [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-G3NN486JFL');
`;

const sandbox = { dataLayer: [] };
const context = new vm.createContext(sandbox);
vm.runInContext(script, context);

console.log(sandbox.dataLayer); // Output the dataLayer array after executing the script