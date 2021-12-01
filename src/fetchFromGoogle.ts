export default function fetchFromGoogle(
  token: string,
  path: string,
  params: URLSearchParams,
): Promise<any> {
  return fetch(
    'https://www.googleapis.com/calendar/v3/' + path + '?' + params,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  ).then(response => response.json());
}
