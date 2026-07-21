/**
 * ATOM CRM brand palette (docs/atom-mobile-approvals-design-brief.md §4). Semantic colors
 * carry over from the ATOM web app exactly, since users already read Pending/Won/Killed/Active
 * by these hues.
 */

import { Platform } from 'react-native';

const tintColorLight = '#F26522';
const tintColorDark = '#F26522';

export const AtomColors = {
  orange: '#F26522',
  orangeWash: '#FDECE3',
  pageGray: '#EEF1F5',
  surface: '#FFFFFF',
  ink: '#1F2733',
  slate: '#6B7280',
  hairline: '#E5E7EB',
  pending: '#F5A623',
  success: '#27AE60',
  danger: '#E24B4A',
  info: '#2D9CDB',
};

export const Colors = {
  light: {
    text: AtomColors.ink,
    textSecondary: AtomColors.slate,
    background: AtomColors.pageGray,
    surface: AtomColors.surface,
    border: AtomColors.hairline,
    tint: tintColorLight,
    tintWash: AtomColors.orangeWash,
    icon: AtomColors.slate,
    tabIconDefault: AtomColors.slate,
    tabIconSelected: tintColorLight,
    pending: AtomColors.pending,
    success: AtomColors.success,
    danger: AtomColors.danger,
    info: AtomColors.info,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    surface: '#1F2126',
    border: '#2C2F33',
    tint: tintColorDark,
    tintWash: '#3A2A22',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    pending: AtomColors.pending,
    success: AtomColors.success,
    danger: AtomColors.danger,
    info: AtomColors.info,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
