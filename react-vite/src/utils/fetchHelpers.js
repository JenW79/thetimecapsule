export const getCSRFToken = () => {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : '';
  };

  export const fetchWithAuth = async (url, method = 'GET', body = null) => {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
  
    if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
      config.headers['X-CSRFToken'] = getCSRFToken();
    }
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    return fetch(url, config);
  };