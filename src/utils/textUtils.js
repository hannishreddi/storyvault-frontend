// src/utils/textUtils.js

// Utility to safely convert HTML content into clean plain text
export const getPlainText = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};