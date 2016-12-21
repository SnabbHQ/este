/* @flow */
import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  Color,
  Display,
  FlexDirection,
  FlexFlow,
  FlexWrap,
  JustifyContent,
  Styled,
  TopBottomLeftRight,
} from '../themes/types';
import styled from './styled';
import warning from 'warning';

type RhythmOrString = number | string | false;

export type BoxProps = {
  // Element
  className?: string,
  id?: string,
  style?: any,
  // CSS
  alignContent?: AlignContent,
  alignItems?: AlignItems,
  alignSelf?: AlignSelf,
  backgroundColor?: Color | 'transparent',
  border?: true | TopBottomLeftRight,
  borderColor?: Color,
  borderRadius?: number,
  borderWidth?: number,
  display?: Display,
  flex?: number,
  flexBasis?: number | string,
  flexDirection?: FlexDirection,
  flexFlow?: FlexFlow,
  flexGrow?: number,
  flexShrink?: number,
  flexWrap?: FlexWrap,
  height?: RhythmOrString,
  justifyContent?: JustifyContent,
  margin?: RhythmOrString,
  marginBottom?: RhythmOrString,
  marginLeft?: RhythmOrString,
  marginRight?: RhythmOrString,
  marginTop?: RhythmOrString,
  maxHeight?: RhythmOrString,
  maxWidth?: RhythmOrString,
  minHeight?: RhythmOrString,
  minWidth?: RhythmOrString,
  order?: number,
  padding?: RhythmOrString,
  paddingBottom?: RhythmOrString,
  paddingLeft?: RhythmOrString,
  paddingRight?: RhythmOrString,
  paddingTop?: RhythmOrString,
  width?: RhythmOrString,
  // Custom
  marginHorizontal?: RhythmOrString,
  marginVertical?: RhythmOrString,
  paddingHorizontal?: RhythmOrString,
  paddingVertical?: RhythmOrString,
  suppressRhythmWarning?: boolean,
};

const rhythmOrString = (theme, value: RhythmOrString) =>
  typeof value === 'number'
    ? theme.typography.lineHeight * value
    : value || 0;

const directionMapping = {
  marginHorizontal: ['marginLeft', 'marginRight'],
  marginVertical: ['marginTop', 'marginBottom'],
  paddingHorizontal: ['paddingLeft', 'paddingRight'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
};

const propToStyle = (prop, value: any, theme) => {
  switch (prop) {
    // Plain props.
    case 'display':
    case 'flex':
    case 'flexDirection':
    case 'flexFlow':
    case 'flexGrow':
    case 'flexWrap':
    case 'alignItems':
    case 'alignContent':
    case 'justifyContent':
    case 'order':
    case 'flexShrink':
    case 'flexBasis':
    case 'alignSelf':
      return { [prop]: value };
    // Simple rhythmOrString props.
    case 'marginBottom':
    case 'marginLeft':
    case 'marginRight':
    case 'marginTop':
    case 'paddingBottom':
    case 'paddingLeft':
    case 'paddingRight':
    case 'paddingTop':
    case 'width':
    case 'height':
    case 'maxWidth':
    case 'maxHeight':
    case 'minWidth':
    case 'minHeight':
      return {
        [prop]: rhythmOrString(theme, value),
      };
    // Shorthand rhythmOrString props.
    case 'marginHorizontal':
    case 'marginVertical':
    case 'paddingHorizontal':
    case 'paddingVertical': {
      const [d1, d2] = directionMapping[prop];
      return {
        [d1]: rhythmOrString(theme, value),
        [d2]: rhythmOrString(theme, value),
      };
    }
    // Split margin shorthand to be computable.
    case 'margin': {
      return {
        marginBottom: rhythmOrString(theme, value),
        marginLeft: rhythmOrString(theme, value),
        marginRight: rhythmOrString(theme, value),
        marginTop: rhythmOrString(theme, value),
      };
    }
    // Split padding shorthand to be computable.
    case 'padding': {
      return {
        paddingBottom: rhythmOrString(theme, value),
        paddingLeft: rhythmOrString(theme, value),
        paddingRight: rhythmOrString(theme, value),
        paddingTop: rhythmOrString(theme, value),
      };
    }
    // Other props.
    case 'backgroundColor':
      return { backgroundColor: theme.colors[value] };
    case 'borderRadius':
      return { borderRadius: value || theme.border.radius };
    default:
      return null;
  }
};

const propsToStyle = (theme, props) => Object
  .keys(props)
  .reduce((style, prop) => {
    if (prop === 'theme') return style;
    const propStyle = propToStyle(prop, props[prop], theme);
    if (propStyle === null) return style;
    return { ...style, ...propStyle };
  }, {});

// inlehmansterms.net/2014/06/09/groove-to-a-vertical-rhythm
const adjustPaddingForRhythm = (suppressRhythmWarning, border, borderWidth, style) => {
  if (!borderWidth) return {};
  return ['Bottom', 'Left', 'Right', 'Top'].reduce((padding, prop) => {
    const adjust = border === true || border === prop.toLowerCase();
    if (!adjust) return padding;
    const paddingProp = `padding${prop}`;
    const paddingValue = style[paddingProp];
    if (typeof paddingValue === 'string') {
      // If paddingValue is string, we can't compensate it.
      return { ...padding, [paddingProp]: paddingValue };
    }
    const canCompensate = paddingValue && (paddingValue - borderWidth) >= 0;
    if (!canCompensate) {
      if (suppressRhythmWarning) return {};
      const direction = prop === 'Left' || prop === 'Right'
        ? 'horizontal'
        : 'vertical';
      warning(false, [
        `Increase ${paddingProp} to ensure ${direction} rhythm. `,
        'Use suppressRhythmWarning prop to suppress this warning.',
      ].join(''));
    }
    return {
      ...canCompensate ? {} : { outline: 'solid 1px red' },
      ...padding,
      [paddingProp]: paddingValue - borderWidth,
    };
  }, {});
};

const borderWithRhythm = (theme, props, style) => {
  if (!props.border) return style;
  const borderProp = props.border === true
    ? 'border'
    : `border${props.border.charAt(0).toUpperCase()}${props.border.slice(1)}`;
  const borderWidth = props.borderWidth || theme.border.width;
  const borderColor = props.borderColor
    ? theme.colors[props.borderColor]
    : theme.colors.gray;
  const padding = adjustPaddingForRhythm(
    props.suppressRhythmWarning,
    props.border,
    borderWidth,
    style,
  );
  return {
    ...padding,
    [borderProp]: `solid ${borderWidth}px ${borderColor}`,
  };
};

const Box: Styled<BoxProps> = styled((theme, props) => {
  const style = propsToStyle(theme, props);
  return {
    ...style,
    ...borderWithRhythm(theme, props, style),
  };
});

export default Box;
