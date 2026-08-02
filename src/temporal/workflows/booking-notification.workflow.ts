import { proxyActivities } from '@temporalio/workflow';

import type * as activities from '../activities/index.js';

const {sendBookingConfirmationEmailActivity} = proxyActivities<typeof activities>({
  retry: { maximumAttempts: 3},
  startToCloseTimeout: '10 minute',
});
const {sendCancelBookingNotificationActivity} = proxyActivities<typeof activities>({
  retry: { maximumAttempts: 3},
  startToCloseTimeout: '10 minute',
})
export async function sendBookingNotificationWorkflow(bookingId: number) {
    await sendBookingConfirmationEmailActivity(bookingId);
}

export async function sendCancelledBookingNotificationWorkflow(bookingId: number) {
  await sendCancelBookingNotificationActivity(bookingId);
}
