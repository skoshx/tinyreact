# TinyReact

> TinyReact is a TINY implementation of React with hooks, and async/await rendering.

## Features

- Hooks
- Async/await rendering (Concurrent mode)
- useState() with strict types
- Tiny bundle size - only 6.29 KB minified.

###### Download

- [Normal](https://raw.githubusercontent.com/SkoshRG/deno-open/master/index.ts)

## Usage

```js
import { TinyReact } from 'tinyreact';

// Async/await component
const AsyncApp = async () => {
  const [name, setName] = TinyReact.useState('stranger');
  // Fetch data from API
  const response = await fetch('https://dog.ceo/api/breeds/image/random'); 
  const data = await response.json();
  const dogPhotoUrl = data.message;

  return (
    <div className="tinyreact">
      <h1>Hello, {name}!</h1>
      <input type="text" value={name} onchange={(e: Event) => setName((e?.target as HTMLInputElement).value)} />
      <img src={dogPhotoUrl} alt="Good boye" />
    </div>
  );
}
TinyReact.render(AsyncApp, document.getElementById('root'));

// Template setState
const TemplateStateApp = () => {
  const [count, setCount] = TinyReact.useStateTemplate<number>(0);
  return (
    <div className="tinyreact">
      <h1>Count is: {count}</h1>
      <button onclick={(e: MouseEvent) => {setCount(count + 1);}}>+</button>
    </div>
  );
}
TinyReact.render(TemplateStateApp, document.getElementById('root'));

// Normal component
const App = () => {
  const [count, setCount] = TinyReact.useState(0);
  return (
    <div className="tinyreact">
      <h1>Count is: {count}</h1>
      <button onclick={(e: MouseEvent) => {setCount(count + 1);}}>+</button>
    </div>
  );
}
TinyReact.render(App, document.getElementById('root'));
```

## API

The TinyReact class exposes static functions `render`, `useState` and `useStateTemplate`. Support for React style component classes and `setState` might be added if the need for those arise.

### render(reactElement, container)

#### reactElement: `RenderElementType`

The React element to render. Can be of types `ElementType`, `Function`, `Promise<any>`, `string` or `number`.

#### container: `HTMLElement | null`

If the container is null, `render()` will throw an Error.

### useState(initialState)

#### initialState: `any`

The initial state of the useState hook.

### useStateTemplate<T>(initialState)

#### initialState: `T`

The initial state of the useState hook.

## TODO:

https://github.com/ahonn/tiny-react