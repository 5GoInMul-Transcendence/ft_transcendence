'use client';

import StyledComponentsRegistry from './registry';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import GlobalStyle from '@/styles/global-style';
import Modal from '@/component/Modal';
import { RecoilRoot } from 'recoil';
import AxiosApiHadling from '@/utils/AxiosApiHadling';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <RecoilRoot>
          <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
              <AxiosApiHadling />
              <GlobalStyle />
              <Modal />
              {children}
            </ThemeProvider>
          </StyledComponentsRegistry>
        </RecoilRoot>
      </body>
    </html>
  );
}
