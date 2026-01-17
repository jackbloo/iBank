import { render, fireEvent } from '@testing-library/react-native'
import { FormInput } from '../FormInput'

describe('FormInput', () => {
  const mockOnChangeText = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { toJSON } = render(
      <FormInput label="Test" value="" onChangeText={mockOnChangeText} />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('displays the correct label', () => {
    const { getByText } = render(
      <FormInput label="Email Address" value="" onChangeText={mockOnChangeText} />
    )
    expect(getByText('Email Address')).toBeTruthy()
  })

  it('displays the input value', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Name" value="John Doe" onChangeText={mockOnChangeText} />
    )
    expect(getByDisplayValue('John Doe')).toBeTruthy()
  })

  it('shows placeholder text when provided', () => {
    const { getByPlaceholderText } = render(
      <FormInput
        label="Email"
        value=""
        placeholder="Enter your email"
        onChangeText={mockOnChangeText}
      />
    )
    expect(getByPlaceholderText('Enter your email')).toBeTruthy()
  })

  it('calls onChangeText when text input changes', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Name" value="" onChangeText={mockOnChangeText} />
    )
    
    fireEvent.changeText(getByDisplayValue(''), 'New Text')
    
    expect(mockOnChangeText).toHaveBeenCalledWith('New Text')
  })

  it('enables secure text entry when secureTextEntry is true', () => {
    const { getByDisplayValue } = render(
      <FormInput
        label="Password"
        value="secret"
        secureTextEntry={true}
        onChangeText={mockOnChangeText}
      />
    )
    
    const input = getByDisplayValue('secret')
    expect(input.props.secureTextEntry).toBe(true)
  })

  it('does not enable secure text entry by default', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Name" value="test" onChangeText={mockOnChangeText} />
    )
    
    const input = getByDisplayValue('test')
    expect(input.props.secureTextEntry).toBeUndefined()
  })

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <FormInput
        label="Email"
        value="invalid"
        error="Invalid email address"
        onChangeText={mockOnChangeText}
      />
    )
    
    expect(getByText('Invalid email address')).toBeTruthy()
  })

  it('does not display error message when error prop is not provided', () => {
    const { queryByText } = render(
      <FormInput label="Email" value="test@example.com" onChangeText={mockOnChangeText} />
    )
    
    expect(queryByText(/error/i)).toBeNull()
  })

  it('applies error styles to input when error is present', () => {
    const { getByDisplayValue } = render(
      <FormInput
        label="Email"
        value="invalid"
        error="Invalid email"
        onChangeText={mockOnChangeText}
      />
    )
    
    const input = getByDisplayValue('invalid')
    expect(input.props.style).toBeDefined()
  })

  it('handles empty value', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Name" value="" onChangeText={mockOnChangeText} />
    )
    
    expect(getByDisplayValue('')).toBeTruthy()
  })

  it('handles multiple text changes', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Search" value="" onChangeText={mockOnChangeText} />
    )
    
    const input = getByDisplayValue('')
    fireEvent.changeText(input, 'First')
    fireEvent.changeText(input, 'Second')
    fireEvent.changeText(input, 'Third')
    
    expect(mockOnChangeText).toHaveBeenCalledTimes(3)
    expect(mockOnChangeText).toHaveBeenCalledWith('Third')
  })

  it('renders with all optional props', () => {
    const { getByText, getByPlaceholderText, getByDisplayValue } = render(
      <FormInput
        label="Password"
        value="secret123"
        placeholder="Enter password"
        secureTextEntry={true}
        error="Password too short"
        onChangeText={mockOnChangeText}
      />
    )
    
    expect(getByText('Password')).toBeTruthy()
    expect(getByPlaceholderText('Enter password')).toBeTruthy()
    expect(getByDisplayValue('secret123')).toBeTruthy()
    expect(getByText('Password too short')).toBeTruthy()
  })

  it('renders without optional props', () => {
    const { getByText } = render(
      <FormInput label="Name" value="John" onChangeText={mockOnChangeText} />
    )
    
    expect(getByText('Name')).toBeTruthy()
  })

  it('updates when value prop changes', () => {
    const { rerender, getByDisplayValue } = render(
      <FormInput label="Name" value="John" onChangeText={mockOnChangeText} />
    )
    
    expect(getByDisplayValue('John')).toBeTruthy()
    
    rerender(
      <FormInput label="Name" value="Jane" onChangeText={mockOnChangeText} />
    )
    
    expect(getByDisplayValue('Jane')).toBeTruthy()
  })

  it('clears error when error prop is removed', () => {
    const { rerender, getByText, queryByText } = render(
      <FormInput
        label="Email"
        value="test"
        error="Invalid email"
        onChangeText={mockOnChangeText}
      />
    )
    
    expect(getByText('Invalid email')).toBeTruthy()
    
    rerender(
      <FormInput label="Email" value="test" onChangeText={mockOnChangeText} />
    )
    
    expect(queryByText('Invalid email')).toBeNull()
  })

  it('has correct placeholder text color', () => {
    const { getByDisplayValue } = render(
      <FormInput
        label="Email"
        value=""
        placeholder="test@example.com"
        onChangeText={mockOnChangeText}
      />
    )
    
    const input = getByDisplayValue('')
    expect(input.props.placeholderTextColor).toBe('#CBD5E1')
  })

  it('maintains label case as provided', () => {
    const { getByText } = render(
      <FormInput label="Email Address" value="" onChangeText={mockOnChangeText} />
    )
    
    expect(getByText('Email Address')).toBeTruthy()
  })

  it('handles long error messages', () => {
    const longError = 'This is a very long error message that should still be displayed correctly'
    const { getByText } = render(
      <FormInput
        label="Field"
        value=""
        error={longError}
        onChangeText={mockOnChangeText}
      />
    )
    
    expect(getByText(longError)).toBeTruthy()
  })

  it('matches snapshot without error', () => {
    const { toJSON } = render(
      <FormInput label="Email" value="test@example.com" onChangeText={mockOnChangeText} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('matches snapshot with error', () => {
    const { toJSON } = render(
      <FormInput
        label="Email"
        value="invalid"
        error="Invalid email"
        onChangeText={mockOnChangeText}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
