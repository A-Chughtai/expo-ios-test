import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

// Renders currency the way ATOM shows it on the web: "PKR 8,599" / "USD 2,347" (brief §4).
export function MoneyText({
  value,
  currency = 'PKR',
  emphasis = 'normal',
  style,
  ...rest
}: TextProps & {
  value: number | string | null | undefined;
  currency?: string;
  emphasis?: 'normal' | 'hero';
}) {
  const color = useThemeColor({}, 'text');
  const numeric = typeof value === 'string' ? Number(value) : value;
  const formatted =
    numeric === null || numeric === undefined || Number.isNaN(numeric)
      ? '—'
      : `${currency} ${numeric.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <Text
      style={[{ color }, emphasis === 'hero' ? styles.hero : styles.normal, style]}
      {...rest}>
      {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  normal: {
    fontSize: 15,
    fontWeight: '600',
  },
  hero: {
    fontSize: 22,
    fontWeight: '700',
  },
});
