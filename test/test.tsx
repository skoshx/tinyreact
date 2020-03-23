import { TinyReact, React } from '../src/index';

const App = () => {
  const [count, setCount] = TinyReact.useStateTemplate<number>(0);
  return (
    <div className="tinyreact">
      <h1>Count: {count}</h1>
      <button onclick={(e: MouseEvent) => {setCount(count + 1);}}>+</button>
      <button onclick={(e: MouseEvent) => {setCount(count - 1);}}>-</button>
    </div>
  );
};

TinyReact.render(App, document.getElementById('root'));