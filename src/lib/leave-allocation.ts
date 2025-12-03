// Leave Allocation Utility
// Defines leave balance rules based on employment status

export type EmploymentStatus = 'PERMANENT' | 'PROBATION' | 'INTERN' | 'CONTRACT';

export interface LeaveAllocation {
  annual: number;
  casual: number;
  shortLeaveLimit: number; // Per month
}

/**
 * Get leave allocation based on employment status
 * Following new 7/14 rule: 14 Annual, 7 Casual (includes sick), 2 Short Leaves/month
 */
export function getLeaveAllocation(status: EmploymentStatus): LeaveAllocation {
  switch (status) {
    case 'PERMANENT':
      return {
        annual: 14,  // 14 days annual leave
        casual: 7,   // 7 days casual leave (includes sick, half-day)
        shortLeaveLimit: 2, // 2 short leaves per month (doesn't deduct from casual)
      };
    
    case 'PROBATION':
      return {
        annual: 7,   // Reduced: 7 days annual leave
        casual: 3,   // Reduced: 3 days casual leave
        shortLeaveLimit: 1, // 1 short leave per month
      };
    
    case 'INTERN':
      return {
        annual: 0,   // No annual leave
        casual: 3,   // 3 days casual leave (for sick)
        shortLeaveLimit: 0, // No short leave
      };
    
    case 'CONTRACT':
      return {
        annual: 10,  // Configurable: 10 days annual leave
        casual: 5,   // Configurable: 5 days casual leave
        shortLeaveLimit: 2, // 2 short leaves per month
      };
    
    default:
      // Default to permanent allocation
      return {
        annual: 14,
        casual: 7,
        shortLeaveLimit: 2,
      };
  }
}

/**
 * Calculate leave deduction with auto-cascade
 * Priority: Annual → Casual → Unpaid
 */
export interface LeaveDeduction {
  type: 'ANNUAL_LEAVE' | 'CASUAL_LEAVE' | 'SICK_LEAVE' | 'UNPAID_LEAVE';
  days: number;
}

export interface LeaveBalances {
  annual: number;
  casual: number;
  sick: number;
}

export function calculateLeaveDeduction(
  requestedDays: number,
  requestedType: 'ANNUAL_LEAVE' | 'CASUAL_LEAVE' | 'SICK_LEAVE',
  balances: LeaveBalances
): LeaveDeduction[] {
  const breakdown: LeaveDeduction[] = [];
  let remaining = requestedDays;

  // For sick leave, only use sick leave balance (no cascade)
  if (requestedType === 'SICK_LEAVE') {
    if (balances.sick >= remaining) {
      breakdown.push({ type: 'SICK_LEAVE', days: remaining });
      return breakdown;
    } else {
      // Use available sick leave, rest as unpaid
      if (balances.sick > 0) {
        breakdown.push({ type: 'SICK_LEAVE', days: balances.sick });
        remaining -= balances.sick;
      }
      breakdown.push({ type: 'UNPAID_LEAVE', days: remaining });
      return breakdown;
    }
  }

  // For annual leave: Try annual first, then cascade to casual, then unpaid
  if (requestedType === 'ANNUAL_LEAVE') {
    // Use annual leave balance
    if (balances.annual > 0) {
      const used = Math.min(remaining, balances.annual);
      breakdown.push({ type: 'ANNUAL_LEAVE', days: used });
      remaining -= used;
    }

    // Cascade to casual if annual exhausted
    if (remaining > 0 && balances.casual > 0) {
      const used = Math.min(remaining, balances.casual);
      breakdown.push({ type: 'CASUAL_LEAVE', days: used });
      remaining -= used;
    }

    // Cascade to unpaid if both exhausted
    if (remaining > 0) {
      breakdown.push({ type: 'UNPAID_LEAVE', days: remaining });
    }

    return breakdown;
  }

  // For casual leave: Use casual only, then unpaid (no cascade to annual)
  if (requestedType === 'CASUAL_LEAVE') {
    if (balances.casual > 0) {
      const used = Math.min(remaining, balances.casual);
      breakdown.push({ type: 'CASUAL_LEAVE', days: used });
      remaining -= used;
    }

    if (remaining > 0) {
      breakdown.push({ type: 'UNPAID_LEAVE', days: remaining });
    }

    return breakdown;
  }

  return breakdown;
}

/**
 * Format leave breakdown for display
 */
export function formatLeaveBreakdown(breakdown: LeaveDeduction[]): string {
  if (breakdown.length === 0) return '';
  
  if (breakdown.length === 1) {
    const item = breakdown[0];
    return `${item.days} day${item.days > 1 ? 's' : ''} ${formatLeaveType(item.type)}`;
  }

  return breakdown
    .map(item => `${item.days} day${item.days > 1 ? 's' : ''} ${formatLeaveType(item.type)}`)
    .join(' + ');
}

function formatLeaveType(type: string): string {
  return type.replace(/_/g, ' ').toLowerCase();
}

/**
 * Check if employee has sufficient leave balance
 */
export function hasSufficientBalance(
  requestedDays: number,
  requestedType: 'ANNUAL_LEAVE' | 'CASUAL_LEAVE' | 'SICK_LEAVE',
  balances: LeaveBalances,
  allowUnpaid: boolean = true
): boolean {
  const breakdown = calculateLeaveDeduction(requestedDays, requestedType, balances);
  
  if (!allowUnpaid) {
    // Check if any unpaid leave is needed
    return !breakdown.some(item => item.type === 'UNPAID_LEAVE');
  }
  
  // With unpaid allowed, always sufficient
  return true;
}
