export default function fetchFromGoogle(
  token: string,
  path: string,
  params?: URLSearchParams,
): Promise<any> {
  let url = 'https://www.googleapis.com/calendar/v3/' + path;
  if (params) {
    url += '?' + params;
  }
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}
