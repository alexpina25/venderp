import { error } from '../lib/apiResponses';
import assert from 'assert';

export async function test_error() {
  const res = error('fail', 400);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.deepStrictEqual(data, { error: 'fail' });
}
