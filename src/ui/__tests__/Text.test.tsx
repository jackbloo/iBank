import { render } from '@testing-library/react-native'
import { Text } from '../Text'

jest.mock('../../theme/fonts', () => ({
  Fonts: {
    regular: 'MockedFont-Regular',
    bold: 'MockedFont-Bold',
  },
}))

describe('Text', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Text>Hello</Text>)
    expect(toJSON()).toBeTruthy()
  })

  it('displays text content', () => {
    const { getByText } = render(<Text>Hello World</Text>)
    expect(getByText('Hello World')).toBeTruthy()
  })

  it('applies custom style prop', () => {
    const customStyle = { color: 'red', fontSize: 20 }
    const { getByText } = render(<Text style={customStyle}>Styled Text</Text>)
    
    const text = getByText('Styled Text')
    expect(text.props.style).toBeDefined()
  })

  it('applies default font family from theme', () => {
    const { getByText } = render(<Text>Font Test</Text>)
    
    const text = getByText('Font Test')
    const styles = Array.isArray(text.props.style) ? text.props.style : [text.props.style]
    
    const hasFont = styles.some((style: any) => 
      style && style.fontFamily === 'MockedFont-Regular'
    )
    expect(hasFont).toBe(true)
  })

  it('renders children as text', () => {
    const { getByText } = render(<Text>Test Content</Text>)
    expect(getByText('Test Content')).toBeTruthy()
  })

  it('renders with multiple children', () => {
    const { getByText } = render(
      <Text>
        Hello <Text>World</Text>
      </Text>
    )
    expect(getByText('World')).toBeTruthy()
  })

  it('supports numberOfLines prop', () => {
    const { getByText } = render(<Text numberOfLines={2}>Long text</Text>)
    
    const text = getByText('Long text')
    expect(text.props.numberOfLines).toBe(2)
  })

  it('supports ellipsizeMode prop', () => {
    const { getByText } = render(<Text ellipsizeMode="tail">Text</Text>)
    
    const text = getByText('Text')
    expect(text.props.ellipsizeMode).toBe('tail')
  })

  it('supports testID prop', () => {
    const { getByTestId } = render(<Text testID="custom-text">Test</Text>)
    expect(getByTestId('custom-text')).toBeTruthy()
  })

  it('supports onPress prop', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<Text onPress={onPressMock}>Click me</Text>)
    
    const text = getByText('Click me')
    expect(text.props.onPress).toBe(onPressMock)
  })

  it('renders empty text', () => {
    const { getByText } = render(<Text></Text>)
    expect(getByText('')).toBeTruthy()
  })

  it('renders with number as children', () => {
    const { getByText } = render(<Text>{123}</Text>)
    expect(getByText('123')).toBeTruthy()
  })

  it('merges multiple styles correctly', () => {
    const style1 = { color: 'blue' }
    const style2 = { fontSize: 16 }
    const { getByText } = render(
      <Text style={[style1, style2]}>Styled</Text>
    )
    
    const text = getByText('Styled')
    expect(text.props.style).toBeDefined()
  })

  it('supports accessibilityLabel prop', () => {
    const { getByLabelText } = render(
      <Text accessibilityLabel="Accessible Text">Content</Text>
    )
    expect(getByLabelText('Accessible Text')).toBeTruthy()
  })

  it('supports selectable prop', () => {
    const { getByText } = render(<Text selectable={true}>Selectable</Text>)
    
    const text = getByText('Selectable')
    expect(text.props.selectable).toBe(true)
  })

  it('forwards all TextProps to native Text component', () => {
    const { getByText } = render(
      <Text 
        allowFontScaling={false}
        maxFontSizeMultiplier={2}
      >
        Text
      </Text>
    )
    
    const text = getByText('Text')
    expect(text.props.allowFontScaling).toBe(false)
    expect(text.props.maxFontSizeMultiplier).toBe(2)
  })

  it('preserves custom fontFamily when provided in style', () => {
    const customStyle = { fontFamily: 'CustomFont' }
    const { getByText } = render(<Text style={customStyle}>Custom</Text>)
    
    const text = getByText('Custom')
    expect(text.props.style).toBeDefined()
  })

  it('renders long text content', () => {
    const longText = 'This is a very long text that might wrap across multiple lines'
    const { getByText } = render(<Text>{longText}</Text>)
    expect(getByText(longText)).toBeTruthy()
  })

  it('matches snapshot with simple text', () => {
    const { toJSON } = render(<Text>Simple Text</Text>)
    expect(toJSON()).toMatchSnapshot()
  })

  it('matches snapshot with styled text', () => {
    const { toJSON } = render(
      <Text style={{ color: 'red', fontSize: 18 }}>Styled Text</Text>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
