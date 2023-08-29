export const apiHaddling = (resData: string, resStatus: string) => {
  switch (resStatus) {
    // main
    case '0001':
      console.log(resData);
      return true;
    case '0002':
      window.location.href = `http://localhost:3000${resData}`;
      return true;

    // chat
    case '1001':
      console.log(resData);
      return true;
    case '1002':
      window.location.href = `http://localhost:3000${resData}`;
      return true;

    // game
    case '2001':
      console.log(resData);
      return true;
    case '2002':
      window.location.href = `http://localhost:3000${resData}`;
      return true;
  }
  return false;
};
