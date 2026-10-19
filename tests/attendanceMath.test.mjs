import test from 'node:test';
import assert from 'node:assert/strict';
import { attendancePercent, futureAbsencesAllowed, canMeetThreshold } from '../src/attendanceMath.js';

test('attendance percentage handles empty and ordinary records', () => {
  assert.equal(attendancePercent(0, 0), 0);
  assert.equal(attendancePercent(8, 10), 80);
  assert.equal(attendancePercent(3, 4), 75);
});

test('future absence allowance assumes all other future classes are attended', () => {
  assert.equal(futureAbsencesAllowed(8, 10, 10, 75), 3);
  assert.equal(futureAbsencesAllowed(6, 10, 10, 75), 1);
  assert.equal(futureAbsencesAllowed(5, 10, 10, 75), 0);
  assert.equal(futureAbsencesAllowed(16, 20, 10, 80), 2);
  assert.equal(futureAbsencesAllowed(8, 10, 0, 75), 0);
});

test('reachability distinguishes a recoverable shortfall from an impossible target', () => {
  assert.equal(canMeetThreshold(6, 10, 10, 75), true);
  assert.equal(canMeetThreshold(0, 10, 10, 75), false);
  assert.equal(canMeetThreshold(8, 10, 0, 75), true);
  assert.equal(canMeetThreshold(7, 10, 0, 75), false);
});
