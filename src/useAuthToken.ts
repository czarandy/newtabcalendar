import {useEffect, useState} from 'react';

type AuthTokenResult = {
  status: 'pending' | 'available';
  token: string | null;
};

export default function useAuthToken(): [
  AuthTokenResult,
  (token: string) => unknown,
] {
  const [result, setResult] = useState<AuthTokenResult>({
    status: 'pending',
    token: null,
  });
  useEffect(() => {
    chrome.identity.getAuthToken({}, (token: string | null) => {
      setResult({
        status: 'available',
        token,
      });
    });
  }, []);
  return [
    result,
    newToken => setResult({status: 'available', token: newToken}),
  ];
}
