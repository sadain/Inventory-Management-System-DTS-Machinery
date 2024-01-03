export function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

export function getCookieValue(name) {
  let b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

export function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}
