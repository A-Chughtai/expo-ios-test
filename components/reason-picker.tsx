import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

// Quick-pick reason templates to minimize typing on mobile (brief §5.5).
export function ReasonPicker({
  templates,
  onSelect,
}: {
  templates: string[];
  onSelect: (template: string) => void;
}) {
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={styles.row}>
      {templates.map((template) => (
        <Pressable
          key={template}
          style={[styles.chip, { borderColor: tint }]}
          onPress={() => onSelect(template)}>
          <Text style={[styles.chipText, { color: tint }]}>{template}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
});
