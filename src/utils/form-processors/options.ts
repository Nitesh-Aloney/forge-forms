import type { TOptionProcessorFunctionSignature } from '@/types';

export type TConstants = Record<string, { data: { code: string; description: string }[] }>;

export type TRegulatoryRegion = 'SG' | 'AU' | 'EU' | 'HK' | 'UK' | 'US' | 'CA' | 'NZ' | 'JP' | 'ID' | 'NL' | 'MY';
export type TRegulatoryRegionMetadata = {
  value: TRegulatoryRegion;
};
export type TRegulatoryRegionConfig = Record<TRegulatoryRegion, TRegulatoryRegionMetadata>;

export type TCountryMetadata = {
  code: string;
  countryName: string;
  mobileCountryCode: string;
  currencyCode: string;
  currencyName: string;
};
export type TCountryConfig = Record<string, TCountryMetadata>;

export const extractFromConstants = (data: TConstants, key: string) =>
  data?.[key]?.data?.map?.(({ code, description }) => ({
    label: description,
    value: code,
  })) || [];

export const options_extractCountryNames: TOptionProcessorFunctionSignature = <D>(data: D) =>
  Object.values(data as TCountryConfig)?.map?.(({ countryName, code }) => ({
    label: countryName,
    value: code,
  })) || [];

export const options_extractMobileCountryCodes: TOptionProcessorFunctionSignature = <D>(data: D) =>
  Object.values(data as TCountryConfig)?.map?.(({ countryName, mobileCountryCode }) => ({
    label: `${countryName} (+${mobileCountryCode})`,
    value: mobileCountryCode,
  })) || [];

export const options_extractCurrencyCodes: TOptionProcessorFunctionSignature = <D>(data: D) => {
  const rawCurrencyData =
    Object.values(data as TCountryConfig)?.map?.(({ currencyName, currencyCode }) => ({
      label: currencyName,
      value: currencyCode,
    })) || [];

  const uniqueCurrenciesSet = new Set<string>();
  const uniqueCurrencies = rawCurrencyData.filter(item => {
    const hash = `${item.label}-${item.value}`;
    if (uniqueCurrenciesSet.has(hash)) return false;
    uniqueCurrenciesSet.add(hash);
    return true;
  });

  return Array.from(uniqueCurrencies);
};

export const options_extractRegions: TOptionProcessorFunctionSignature = <D>(data: D) =>
  (Object.values(data as TRegulatoryRegionConfig) as TRegulatoryRegionMetadata[])?.map?.(({ value }) => ({
    label: value,
    value,
  })) || [];
