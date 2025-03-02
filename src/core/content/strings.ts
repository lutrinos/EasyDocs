
/**
 * Replaces variables in a string with their corresponding values, supporting nested variables
 */
type Variables = {
    [key: string]: string | string[] | Variables;
};

export const interpolate = (template: string, variables: Variables): string => {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = path.trim().split('.')
      .reduce((obj: Variables, key: string) => obj && obj[key], variables);
    
    return value !== undefined ? value : match;
  });
};

/**
 * Joins path segments and ensures the result starts with '/' and has no trailing slash
 */
export const joinURL = (...segments: string[]): string => {
  const path = segments
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/') // Replace multiple consecutive slashes with single slash
    .replace(/\/$/, ''); // Remove trailing slash
    
  return path.startsWith('/') ? path : '/' + path;
};

