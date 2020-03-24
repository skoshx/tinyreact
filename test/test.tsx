// import { TinyReact, React } from '../src/index';
// import { TinyReact, React } from '../src/TinyReactNonStatic';
import { TinyReact, React } from '../src/TinyReactNonStatic';

const tinyOne = new TinyReact();
const tinyTwo = new TinyReact();

const App = () => {
  const [count, setCount] = tinyOne.useStateTemplate<number>(0);
  return (
    <div className="tinyreact">
      <h1>Count: {count}</h1>
      <button onclick={(e: MouseEvent) => {setCount(count + 1);}}>+</button>
      <button onclick={(e: MouseEvent) => {setCount(count - 1);}}>-</button>
    </div>
  );
};

const SecondApp = () => {
  const [name, setName] = tinyTwo.useStateTemplate<string>('stranger');
  return (
    <div className="tinyreact">
      <h1>Hello, {name}!</h1>
      <input onchange={(e: Event) => {setName((e?.target as HTMLInputElement).value);}} value={name} placeholder="Whats your name?" />
    </div>
  );
};

// Render two different apps
// TinyReact.render(SecondApp, document.getElementById('root2'));
tinyOne.render(App, document.getElementById('root'));
tinyTwo.render(SecondApp, document.getElementById('root2'));
// TinyReact.render(App, document.getElementById('root'));