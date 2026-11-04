/**
 * Shared normalization helper for admin dashboard data
 * Ensures consistent data structure and safe property access
 */

/**
 * Normalizes SOS data from MongoDB schema to admin UI format
 * @param {Object} sos - Raw SOS object from API
 * @returns {Object} Normalized SOS object
 */
export const normalizeSOS = (sos) => {
  if (!sos || typeof sos !== 'object') {
    return {
      _id: null,
      latitude: null,
      longitude: null,
      address: null,
      timestamp: null,
      status: 'PENDING',
      title: 'Unknown SOS',
      sourceType: 'SOS',
      severity: 'HIGH',
    };
  }

  // Status mapping: Backend enum → Admin UI
  const statusMap = {
    PENDING: 'PENDING',
    ACKNOWLEDGED: 'COMPLETED',
    CONVERTED: 'FALSE_ALARM',
  };

  // Extract location safely
  const lat = sos.location?.lat;
  const lng = sos.location?.lng;
  const address = sos.location?.address;

  // Normalize coordinates - ensure they're numbers or null
  let latitude = null;
  let longitude = null;
  
  if (lat !== undefined && lat !== null && !isNaN(Number(lat))) {
    latitude = Number(lat);
  }
  
  if (lng !== undefined && lng !== null && !isNaN(Number(lng))) {
    longitude = Number(lng);
  }

  // Normalize timestamp - ensure valid date or null
  let timestamp = null;
  if (sos.createdAt) {
    const date = new Date(sos.createdAt);
    if (!isNaN(date.getTime())) {
      timestamp = sos.createdAt;
    }
  }

  return {
    ...sos,
    latitude,
    longitude,
    address: address || null,
    timestamp,
    status: statusMap[sos.status] || sos.status || 'PENDING',
  };
};

/**
 * Normalizes incident/alert data for admin UI
 * @param {Object} alert - Raw alert/incident object from API
 * @returns {Object} Normalized alert object
 */
export const normalizeAlert = (alert) => {
  if (!alert || typeof alert !== 'object') {
    return {
      _id: null,
      title: 'Unknown Alert',
      message: '',
      description: '',
      createdAt: null,
      severity: 'LOW',
      status: 'PENDING',
      typeTag: 'UNKNOWN',
      source: 'Unknown',
    };
  }

  // Normalize timestamp
  let createdAt = null;
  if (alert.createdAt) {
    const date = new Date(alert.createdAt);
    if (!isNaN(date.getTime())) {
      createdAt = alert.createdAt;
    }
  }

  return {
    ...alert,
    title: alert.title || alert.message || 'Untitled',
    message: alert.message || alert.description || '',
    description: alert.description || alert.message || '',
    createdAt,
    severity: alert.severity || 'LOW',
    status: alert.status || 'PENDING',
    typeTag: alert.typeTag || 'UNKNOWN',
    source: alert.source || alert.author || 'Unknown',
  };
};

/**
 * Safe date formatter - returns formatted string or fallback
 * @param {string|Date|null|undefined} dateValue - Date value to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date string or fallback
 */
export const formatDate = (dateValue, fallback = 'Date unavailable') => {
  if (!dateValue) return fallback;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    return date.toLocaleString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
};

/**
 * Safe date formatter for date-only (no time)
 * @param {string|Date|null|undefined} dateValue - Date value to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date string or fallback
 */
export const formatDateOnly = (dateValue, fallback = 'Date unavailable') => {
  if (!dateValue) return fallback;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
};

/**
 * Safe number formatter with toFixed
 * @param {number|null|undefined} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @param {string} fallback - Fallback text if value is invalid
 * @returns {string} Formatted number string or fallback
 */
export const formatNumber = (value, decimals = 6, fallback = 'N/A') => {
  if (value === null || value === undefined) return fallback;
  
  const num = Number(value);
  if (isNaN(num)) return fallback;
  
  try {
    return num.toFixed(decimals);
  } catch (error) {
    console.error('Number formatting error:', error);
    return fallback;
  }
};

