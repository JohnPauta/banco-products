// 👉 Mock básico para propiedades del DOM usadas por Angular
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', { value: '<!DOCTYPE html>' });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({ getPropertyValue: () => '' }),
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({ enumerable: true, configurable: true }),
});
