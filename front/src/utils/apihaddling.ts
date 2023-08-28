import { routePush } from './router';

export const apiHaddling = (resData: string, resStatus: string) => {
  switch (resStatus) {
    // main
    case '0001':
      console.log(resData);
      break;
    case '0002':
      routePush(resData);
      break;

    // chat
    case '1001':
      console.log(resData);
      break;
    case '1002':
      routePush(resData);
      break;

    // game
    case '2001':
      console.log(resData);
      break;
    case '2002':
      routePush(resData);
      break;
  }
};
