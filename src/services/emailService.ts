import { LeadSubmission, HomeValuationSubmission } from '../lib/supabase';

/**
 * Dispatches lead email notifications to the backend Serverless API
 */
export async function triggerLeadEmailNotification(payload: {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message?: string;
  propertyId?: string;
  agentId?: string;
  metadata?: Record<string, any>;
  address?: string;
}): Promise<boolean> {
  try {
    const response = await fetch('/api/send-lead-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('Lead email notification response status:', response.status);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error) {
    // In local Vite dev or static mode, /api might not be running unless using Vercel CLI, so fail silently
    console.info('Email notification dispatched (or skipped in local dev):', error);
    return false;
  }
}
