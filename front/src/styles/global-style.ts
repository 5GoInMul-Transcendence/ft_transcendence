import { createGlobalStyle } from "styled-components";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
		border: 0;
    box-sizing: border-box;
		font-size: 100%;
  }
	
	body {
		width: 100vw;
    height: 100vh;
		background-color: ${({ theme }) => theme.colors.black};
		color: ${({ theme }) => theme.colors.white};
		font-family: ${pressStart2P.style.fontFamily};
	}

	button {
		all: unset;
		cursor:pointer;
	}

	input {
		all: unset;
	}

	a {
  color: inherit;
  text-decoration: none;
	cursor: pointer;
	}
`;

export default GlobalStyle;
