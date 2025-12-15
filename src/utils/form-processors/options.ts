import type { TOptionProcessorFunctionSignature } from '@/features/dynamic-forms/types';
import type { TRFIConstants } from '@/hooks/api/useGetConstants';
import type { TCountryConfig, TRegulatoryRegionConfig, TRegulatoryRegionMetadata } from '@/types/region';

export const extractFromConstants = (data: TRFIConstants, key: string) =>
  data?.[key]?.data?.map?.(({ code, description }) => ({
    label: description,
    value: code,
  })) || [];

export const options_extractIntendedUseOfAccount: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'intendedUseOfAccount');

export const options_extractMonTxnVol: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'monthlyTransactionVolume');

export const options_extractAvgTxnValue: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'averageTransactionValue');

export const options_extractIntendedUses: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'intendedUseOfAccount');

export const options_extractTotalEmployees: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'totalEmployees');

export const options_extractListedExchange: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'listedExchange');

export const options_extractUnregulatedTrustTypes: TOptionProcessorFunctionSignature = <D>(data: D) =>
  extractFromConstants(data as TRFIConstants, 'unregulatedTrustType');

export const options_extractStates = ((data: TRFIConstants) =>
  extractFromConstants(data, 'isoState')) as TOptionProcessorFunctionSignature;

export const options_extractStreetTypes = ((data: TRFIConstants) =>
  extractFromConstants(data, 'streetType')) as TOptionProcessorFunctionSignature;

export const options_extractTrustBeneficiaryClass = ((data: TRFIConstants) =>
  extractFromConstants(data, 'trustBeneficiaryClass')) as TOptionProcessorFunctionSignature;

export const options_extractAnnualTurnover = ((data: TRFIConstants) =>
  extractFromConstants(data, 'annualTurnover')) as TOptionProcessorFunctionSignature;

export const options_extractIndustrySectors = ((data: TRFIConstants) =>
  extractFromConstants(data, 'industrySector')) as TOptionProcessorFunctionSignature;

export const options_extractExpectedMonthlyTransactionVolume = ((data: TRFIConstants) =>
  extractFromConstants(data, 'monthlyTransactions')) as TOptionProcessorFunctionSignature;

export const options_extractPositions = ((data: TRFIConstants) =>
  extractFromConstants(data, 'position')) as TOptionProcessorFunctionSignature;

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
