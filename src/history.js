import { normalizeWork, levels, sources } from '../lib/work.js';

const storageKey = 'sprintpointer.history.v1';

function validEntry(entry) {
  try {
    normalizeWork(entry.form);
    const { result } = entry;
    return typeof entry.id === 'string' && Number.isFinite(Date.parse(entry.createdAt)) &&
      typeof result.title === 'string' && typeof result.description === 'string' &&
      Object.hasOwn(levels, result.difficulty) && Object.hasOwn(levels, result.confidence) &&
      Object.hasOwn(sources, result.source) &&
      [result.hours, result.minHours, result.maxHours].every(hours => Number.isSafeInteger(hours) && hours > 0) &&
      result.minHours <= result.hours && result.hours <= result.maxHours &&
      ['criteria', 'reasons', 'assumptions', 'questions'].every(key =>
        Array.isArray(result[key]) && result[key].every(text => typeof text === 'string'));
  } catch {
    return false;
  }
}

export function readHistory() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(entries) ? entries.filter(validEntry).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}
