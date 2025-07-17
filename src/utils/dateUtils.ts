/**
 * Utility functions for date formatting and conversion
 */

/**
 * Converts an ISO date string to YYYY-MM-DD format for HTML date inputs
 * @param isoDate - ISO date string (e.g., "2025-07-18T00:00:00.000Z")
 * @returns Date in YYYY-MM-DD format or empty string if invalid
 */
export const isoToDateInput = (isoDate: string | undefined | null): string => {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error converting ISO date to date input format:', error);
    return '';
  }
};

/**
 * Converts a YYYY-MM-DD date string to ISO format
 * @param dateInput - Date in YYYY-MM-DD format
 * @returns ISO date string or empty string if invalid
 */
export const dateInputToIso = (dateInput: string): string => {
  if (!dateInput) return '';
  
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString();
  } catch (error) {
    console.error('Error converting date input to ISO format:', error);
    return '';
  }
};

/**
 * Formats an ISO date string to a readable format
 * @param isoDate - ISO date string
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export const formatDate = (
  isoDate: string | undefined | null, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formats an ISO datetime string to include time
 * @param isoDateTime - ISO datetime string
 * @returns Formatted datetime string
 */
export const formatDateTime = (isoDateTime: string | undefined | null): string => {
  if (!isoDateTime) return '';
  
  try {
    const date = new Date(isoDateTime);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
}; 