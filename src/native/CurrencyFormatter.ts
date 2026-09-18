import { NativeModules, Platform } from 'react-native';

interface CurrencyFormatterNative {
  format(amount: number, currency: string, locale?: string): Promise<string>;
}

const { CurrencyFormatter } = NativeModules as {
  CurrencyFormatter?: CurrencyFormatterNative;
};

export const CurrencyFormatterApi = {
  format: async (
    amount: number,
    currency = 'USD',
    locale = 'en-US',
  ): Promise<string> => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      return amount.toFixed(2);
    }

    if (!CurrencyFormatter) {
      throw new Error('CurrencyFormatter native module is unavailable');
    }

    return CurrencyFormatter.format(amount, currency, locale);
  },
};
