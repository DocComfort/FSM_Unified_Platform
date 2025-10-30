import type { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

type ToneStyles = {
  container: ViewStyle;
  title: TextStyle;
  text: TextStyle;
};

const toneStyles: Record<BannerTone, ToneStyles> = {
  info: createToneStyles('#0ea5e9'),
  success: createToneStyles('#10b981'),
  warning: createToneStyles('#f59e0b'),
  danger: createToneStyles('#ef4444'),
};

export function Banner({
  tone = 'info',
  title,
  children,
}: PropsWithChildren<{ title: string; tone?: BannerTone }>) {
  const palette = toneStyles[tone];
  return (
    <View style={[styles.container, palette.container]}>
      <Text style={[styles.title, palette.title]}>{title}</Text>
      <Text style={[styles.text, palette.text]}>{children}</Text>
    </View>
  );
}

function createToneStyles(color: string): ToneStyles {
  return {
    container: { borderColor: color, backgroundColor: `${color}22` },
    title: { color },
    text: { color },
  };
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
