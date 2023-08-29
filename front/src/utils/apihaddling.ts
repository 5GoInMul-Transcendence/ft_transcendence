export const apiHaddling = (resData: string, resStatus: string) => {
  switch (resStatus) {
    // main
    case '0001':
      console.log(resData);
      break;
    case '0002':
      window.location.href = `http://localhost:3000${resData}`;
      break;

    // chat
    case '1001':
      console.log(resData);
      break;
    case '1002':
      window.location.href = `http://localhost:3000${resData}`;

      break;

    // game
    case '2001':
      console.log(resData);
      break;
    case '2002':
      window.location.href = `http://localhost:3000${resData}`;

      break;
  }
};
