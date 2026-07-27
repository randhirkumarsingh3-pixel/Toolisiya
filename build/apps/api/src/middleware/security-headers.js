const securityHeaders = (req, res, next) => {
  // Strict-Transport-Security: Force HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // X-Content-Type-Options: Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // X-XSS-Protection: Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Content-Security-Policy: Restrict resource loading
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self'"
  );

  // Referrer-Policy: Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Restrict sensitive APIs
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  next();
};

export default securityHeaders;