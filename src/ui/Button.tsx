import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface Props {
  title: string
  onPress: () => void
}

export const Button: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: '#006970',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006970',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
})
