import { arraysShareItem } from '#utils'
import assert from 'node:assert'
import test from 'node:test'

test("Returns 'partial' for one array with atleast one common element", () => {
  const actual = arraysShareItem('Central', ['Central', 'Superior'])
  const expected = 'partial'
  assert.equal(actual, expected)
})

test("Returns 'partial' for one array with atleast one common element", () => {
  const actual = arraysShareItem(['Central', 'Superior'], 'Central')
  const expected = 'partial'
  assert.equal(actual, expected)
})

test('Returns true for two arrays with the same elements', () => {
  const actual = arraysShareItem(
    ['Superior', 'Central'],
    ['Central', 'Superior']
  )
  const expected = true
  assert.equal(actual, expected)
})

test("Returns 'partial' for two arrays with atleast one common element", () => {
  const actual = arraysShareItem(
    ['Superior', 'Central', 'Jungla'],
    ['Central', 'Superior']
  )
  const expected = 'partial'
  assert.equal(actual, expected)
})

test('Returns false if one parameter is not an array', () => {
  const actual = arraysShareItem({ test: 1 }, ['Central', 'Superior'])
  const expected = false
  assert.equal(actual, expected)
})

test('Returns false if none of the arrays does not share items', () => {
  const actual = arraysShareItem(
    ['Inferior', 'Soporte'],
    ['Central', 'Superior']
  )
  const expected = false
  assert.equal(actual, expected)
})

test('Returns false if both parameters are strings and does not match', () => {
  const actual = arraysShareItem('Inferior', 'Superior')
  const expected = false
  assert.equal(actual, expected)
})

test('Returns true if both parameters are strings and does match', () => {
  const actual = arraysShareItem('Inferior', 'Inferior')
  const expected = true
  assert.equal(actual, expected)
})
