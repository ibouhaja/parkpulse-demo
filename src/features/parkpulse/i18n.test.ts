import { describe, expect, it } from 'vitest';
import { readLang, translate } from './i18n';
import { tariffDescription, tariffs } from './tariffs';
import { money, payMethodLabel, payMethodLabelEn } from './data';
import { categoryLabels, categoryLabelsEn, vehicleLabels, vehicleLabelsEn } from './parking-plan';
import { reservationStatusLabels, reservationStatusLabelsEn } from './cancellation-rules';
import { preferenceVehicles, preferenceVehiclesEn } from './preferences';
import { demoModelLabels, demoModelLabelsEn } from './parking-3d-rules';
import { authErrorText } from './auth-errors';

describe('readLang', () => {
  it('defaults to German without storage or unknown values', () => {
    expect(readLang()).toBe('de');
    expect(readLang(() => null)).toBe('de');
    expect(readLang(() => 'fr')).toBe('de');
  });
  it('reads a persisted English choice', () => {
    expect(readLang((k) => (k === 'parkpulse-lang' ? 'en' : null))).toBe('en');
  });
});

describe('translate', () => {
  it('returns the German source for de', () => {
    expect(translate('de', 'Parkplatz finden')).toBe('Parkplatz finden');
  });
  it('translates known strings to English', () => {
    expect(translate('en', 'Parkplatz finden')).toBe('Find parking');
    expect(translate('en', 'Als Gast fortfahren')).toBe('Continue as guest');
    expect(translate('en', 'Demo – fiktive Parkdaten, keine Live-Verfügbarkeit, keine echte Zahlung.')).toBe('Demo – fictional parking data, no live availability, no real payment.');
  });
  it('falls back to the German source for unknown strings', () => {
    expect(translate('en', 'Ein unbekannter Text')).toBe('Ein unbekannter Text');
  });
});

describe('label maps', () => {
  it('every German label map has a complete English variant', () => {
    for (const k of Object.keys(categoryLabels) as (keyof typeof categoryLabels)[]) expect(categoryLabelsEn[k]).toBeTruthy();
    for (const k of Object.keys(vehicleLabels) as (keyof typeof vehicleLabels)[]) expect(vehicleLabelsEn[k]).toBeTruthy();
    for (const k of Object.keys(reservationStatusLabels) as (keyof typeof reservationStatusLabels)[]) expect(reservationStatusLabelsEn[k]).toBeTruthy();
    for (const k of Object.keys(preferenceVehicles) as (keyof typeof preferenceVehicles)[]) expect(preferenceVehiclesEn[k]).toBeTruthy();
    for (const k of Object.keys(demoModelLabels) as (keyof typeof demoModelLabels)[]) expect(demoModelLabelsEn[k]).toBeTruthy();
    for (const k of Object.keys(payMethodLabel) as (keyof typeof payMethodLabel)[]) expect(payMethodLabelEn[k]).toBeTruthy();
  });
});

describe('money and tariff formatting', () => {
  it('formats EUR in German and English locales', () => {
    expect(money(1.5)).toContain('1,50');
    expect(money(1.5, 'en')).toContain('1.50');
    expect(money(1.5, 'en')).toContain('€');
  });
  it('describes tariffs in both languages', () => {
    expect(tariffDescription(tariffs['quartier']!)).toContain('erste Stunde');
    expect(tariffDescription(tariffs['quartier']!, 'en')).toContain('first hour');
  });
});

describe('authErrorText', () => {
  it('maps known errors to English when requested', () => {
    expect(authErrorText({ code: 'invalid_credentials' }, undefined, 'en')).toBe('Email or password is incorrect.');
    expect(authErrorText({ code: 'invalid_credentials' })).toBe('E-Mail oder Passwort ist falsch.');
  });
  it('keeps the fallback for unknown errors in both languages', () => {
    expect(authErrorText({ code: 'other' }, 'Fallback Deutsch', 'en')).toBe('Fallback Deutsch');
  });
});
