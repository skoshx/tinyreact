/**
 * TinyReact - a TINY implementation of React. Used by MCMS to render admin
 * dashboard pages dynamically.
 */

export interface PropType {
  children: HTMLElement | Promise<any> | string | number;
};

export interface ElementType {
  tag: string;
  props: any;
}

export type SetStateFunction = (newState: any) => void;
export type TemplateSetStateFunction<T> = (newState: T) => void;
// TODO: Implement previousState? Might be important for checking for changes
// type SetStateFunction = (newState: any, previousState: any) => void;

export type StateReturnType = [any, SetStateFunction];
export type TemplateStateReturnType<T> = [T, TemplateSetStateFunction<T>];

export type RenderElementType = ElementType | Function | Promise<any> | string | number;

export interface ReactHTMLElement extends HTMLElement {
  [index: string]: any;
}

export const React = {
  createElement: (tag: string | Function, props: PropType, ...children: PropType[]): ElementType => {
    if (typeof tag === 'function') { return tag(props); }
    const element: ElementType = {tag, props: {...props, children}};
    return element;
  }
}

export class TinyReact {
  // The state can contain any datatype.
  private static states: any[] = [];
  private static stateCursor: number = 0;
  
  private static componentFunction: Function;
  private static container: HTMLElement;

  public static async render(reactElement: RenderElementType, container: HTMLElement | null) {
    if (!container) {
      throw Error(`Container passed to TinyReact.render() is null. Make sure you pass an HTMLElement that has exists in the DOM.`);
    }
    if (!this.componentFunction && typeof reactElement === 'function') this.componentFunction = reactElement;
    if (!this.container) this.container = container;

    reactElement = typeof reactElement === 'function' ? reactElement() : reactElement;

    if (['string', 'number'].includes(typeof reactElement)) {
      container.appendChild(document.createTextNode(String(reactElement)));
      return;
    }
  
    // If reactElement is a Promise, await it
    if (reactElement instanceof Promise) {
      // Await reactElement, to get the actual element with all Promises resolved
      const awaitedElement = await reactElement;
      if (typeof awaitedElement === 'object') {
        // Render Async/await component
        this.render(awaitedElement, container);
        return;
      } else if (typeof awaitedElement === 'string') {
        // Render element that contains a Promise
        container.appendChild(document.createTextNode(String(await reactElement)));
        return;
      }
    }

    if (this.isReactElement(reactElement)) {
      // const domElement: HTMLElement = document.createElement(reactElement.tag);
      const domElement: ReactHTMLElement = document.createElement(reactElement.tag) as ReactHTMLElement;
      if (reactElement.props) {
        // Object.keys(reactElement.props).filter(p => p !== 'children').forEach(p => domElement[p] = reactElement.props[p]);
        Object.keys(reactElement.props).filter(p => p !== 'children').forEach(async p => {
          // Type checking for type safety
          if (this.isReactElement(reactElement)) {
            if (typeof reactElement.props[p].then === 'function') {
              return domElement[p] = await reactElement.props[p]; // Await Promise
            }
            return domElement[p] = reactElement.props[p];
          } else {
            throw Error(`${reactElement} is not of type 'ElementType' for some reasson.`);
          }
        });
      }
      if (reactElement.props.children) {
        // Render children recursively
        reactElement.props.children.forEach((child: RenderElementType) => {
          return this.render(child, domElement);
        });
        // reactElement.props.children.forEach(child => this.render(child, domElement));
      }

      // Remove old content if it exists
      if (this.container.firstChild) {
        this.container.firstChild.remove();
      }
      // Append new content
      container.appendChild(domElement);
    } else {
      throw Error(`${reactElement} is not of type 'ElementType' for some reasson.`);
    }
  }

  // TODO(SkoshRG): Test that useState & useStateTemplate can be used interchangeably
  public static useStateTemplate<T>(initialState: T): TemplateStateReturnType<T> {
    const FROZENCURSOR: number = this.stateCursor;
    this.states[FROZENCURSOR] = this.states[FROZENCURSOR] ?? initialState;
    const setState = (newState: T) => {
      console.log('Setting state:')
      console.log('Before setting state:')
      console.log(this.states);
      this.states[FROZENCURSOR] = newState;
      console.log('After:');
      console.log(this.states);
      this.rerender();
    };
    this.stateCursor++;
    return [this.states[FROZENCURSOR], setState];
  }

  public static useState(initialState: any): StateReturnType {
    const FROZENCURSOR: number = this.stateCursor;
    this.states[FROZENCURSOR] = this.states[FROZENCURSOR] ?? initialState;
    const setState = (newState: any) => {
      this.states[FROZENCURSOR] = newState;
      this.rerender();
    };
    this.stateCursor++;
    return [this.states[FROZENCURSOR], setState];
  }

  private static async rerender(): Promise<void> {
    this.stateCursor = 0;
    this.render(this.componentFunction, this.container);
  }

  private static isReactElement(reactElement: RenderElementType): reactElement is ElementType {
    return (!['string', 'number', 'function'].includes(typeof reactElement))
      && !(reactElement instanceof Promise)
      && (reactElement as ElementType).tag !== undefined;
  }
}