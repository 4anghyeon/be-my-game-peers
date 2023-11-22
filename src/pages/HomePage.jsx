import React, {useEffect} from 'react';
import {getAuth} from 'firebase/auth';

const HomePage = () => {
  useEffect(() => {
    // 로그인되어 있으면 다시 메인으로..
    console.log(getAuth().currentUser);
  }, []);
  return <div></div>;
};

export default HomePage;
