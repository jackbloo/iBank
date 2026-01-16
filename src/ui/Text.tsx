import { Text as AppText, TextProps } from 'react-native';
import { Fonts } from '../theme/fonts';

export function Text(props: TextProps) {
  return (
    <AppText
      style={[{ fontFamily: Fonts.regular}, props.style]}
      {...props}
    />
  );
}
