import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    flex: { [key: string]: string };
    colors: { [key: string]: string };
    fontSize: { [key: string]: string };
  }
}
