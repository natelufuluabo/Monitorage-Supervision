const url = "http://localhost:8000";

const resCounter = await fetch(`${url}/counter`);
const resSleep = await fetch(`${url}/sleep`);
const resExample = await fetch(`${url}/example.com`);
console.log(await resExample.text())