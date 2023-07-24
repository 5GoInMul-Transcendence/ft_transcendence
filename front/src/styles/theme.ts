import { DefaultTheme } from 'styled-components';

const flex = {
  center: `
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  right: `
    display: flex;
    justify-content: right;
    align-items: center;
  `,
  centerColumn: `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  spaceBetween: `
    display: flex;
  justify-content: space-between;
    align-items: center;
  `,
};

const colors = {
  black: '#202020',
  darkgrey: '#303030',
  grey: '#808080',
  lightgrey: '#d0d0d0',
  green: '#50ff50',
  yellow: '#ffff50',
  pink: '#ff50ff',
  white: '#ffffff',
};

const fontSize = {
  xxlarge: '32px',
  xlarge: '28px',
  large: '24px',
  normal: '20px',
  small: '16px',
  xsmall: '12px',
  xxsmall: '10px',
};

export const theme: DefaultTheme = {
  flex,
  colors,
  fontSize,
};
