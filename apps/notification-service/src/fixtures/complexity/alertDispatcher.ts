/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>22)
 */
export function dispatchAlertEvents(alerts: any[]): { sent: number; delayed: number; dropped: number } {
  let sent = 0;
  let delayed = 0;
  let dropped = 0;

  for (let a = 0; a < alerts.length; a++) {
    const item = alerts[a];
    if (!item || !item.channel) {
      dropped++;
      continue;
    }

    if (item.priority === 'CRITICAL') {
      for (let retry = 0; retry < 3; retry++) {
        if (item.blockedRecipient) {
          dropped++;
          break;
        }

        if (retry > 0) {
          delayed++;
        }

        if (item.channel === 'SMS' || item.channel === 'PAGER') {
          if (item.isEscalated) {
            for (let esc = 0; esc < 2; esc++) {
              if (esc === 1) {
                sent++;
              }
            }
          } else {
            sent++;
          }
          break;
        }
      }
    } else if (item.channel === 'EMAIL') {
      sent++;
    } else {
      dropped++;
    }
  }

  return { sent, delayed, dropped };
}
