/* @jsx jsx */

import React from 'react';

import {
  ClassComponent,
  ResultNode,
  render,
  setRoute,
  getRoute,
  getRouteParam,
  redraw,
  Component,
  jsx,
} from 'mithrilInterop';

type FindYourTokenInputComponentAttrs = {
  onchangeValue: (event: any) => void;
  onkeyupValue: (event: any) => void;
};

export class FindYourTokenInputComponent extends ClassComponent<FindYourTokenInputComponentAttrs> {
  view(vnode: ResultNode<FindYourTokenInputComponentAttrs>) {
    return (
      <input
        autoComplete="off"
        className="p-2 flex-grow mr-2 text-xl text-gray-400 pt-3.5 focus:outline-none"
        id="token-input"
        type="text"
        placeholder="Find your favorite token"
        onInput={vnode.attrs.onchangeValue}
        onKeyUp={vnode.attrs.onkeyupValue}
      />
    );
  }
}