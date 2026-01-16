import { Text, TextProps } from 'react-native';
import { Fonts } from '../theme/fonts';

export default function AppText(props: TextProps) {
  return (
    <Text
      style={[{ fontFamily: Fonts.regular}, props.style]}
      {...props}
    />
  );
}
