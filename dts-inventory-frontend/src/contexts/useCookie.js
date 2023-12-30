import { useState } from "react";
import { setCookie, getCookieValue } from "api/constants";

export const useCookie = (cookieName) => {
  const [cookieValue, setCookieValue] = useState(() => {
    try {
      const value = getCookieValue(cookieName);
      if (value) {
        return value;
      } else {
        setCookie(cookieName, "");
        return "";
      }
    } catch (err) {
      return "";
    }
  });

  const setValue = (newValue) => {
    try {
      setCookie(cookieName, newValue);
    } catch (err) { }
    setCookieValue(newValue);
  };

  return [cookieValue, setValue];
};
