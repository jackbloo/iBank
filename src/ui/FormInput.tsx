import { View, Text, TextInput, StyleSheet } from 'react-native'

interface Props {
  label: string
  value: string
  placeholder?: string
  secureTextEntry?: boolean
  error?: string
  onChangeText: (text: string) => void
}

export const FormInput: React.FC<Props> = ({
  label,
  value,
  placeholder,
  secureTextEntry,
  error,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={[
          styles.input,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor="#CBD5E1"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: '#EF4444',
  },
})
