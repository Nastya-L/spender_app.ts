interface ObjectToken {
  token: string
  time: string
}

const createToken = (): ObjectToken => {
  const abc: string = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let token: string = '';
  for (let i = 0; i < 16; i++) {
    token += abc[Math.floor(Math.random() * (abc.length - 1))];
  }

  const tokenObj = {
    token: token,
    time: Date()
  };

  return tokenObj;
};

export default createToken;
