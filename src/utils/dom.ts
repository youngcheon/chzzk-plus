import React from "react";
import ReactDOM from "react-dom/client";

export const createReactElement = (
  root: Element,
  element: () => JSX.Element
) => {
  ReactDOM.createRoot(root).render(React.createElement(element));
};

export async function waitingElement(selector: string): Promise<HTMLElement> {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector) as HTMLElement;
}
