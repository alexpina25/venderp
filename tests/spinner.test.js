import assert from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Spinner } from '../components/ui/spinner';

export function test_render() {
  const html = renderToString(React.createElement(Spinner));
  assert.ok(html.includes('div'));
}
