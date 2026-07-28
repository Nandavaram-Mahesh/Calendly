import { proxyActivities } from '@temporalio/workflow';

import type * as activities from '../activities/index.js';

const {sendBookingConfirmationEmailActivity} = proxyActivities<typeof activities>({
  retry: { maximumAttempts: 3},
  startToCloseTimeout: '10 minute',
});
export async function sendBookingNotificationWorkflow(bookingId: number) {
    await sendBookingConfirmationEmailActivity(bookingId);
}