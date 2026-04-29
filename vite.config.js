import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        tos: resolve(__dirname, 'tos.html'),
        notfound: resolve(__dirname, '404.html'),
        sample_1: resolve(__dirname, 'samples/sample_1.html'),
        sample_2: resolve(__dirname, 'samples/sample_2.html'),
        sample_3: resolve(__dirname, 'samples/sample_3.html'),
        sample_4: resolve(__dirname, 'samples/sample_4.html'),
        sample_5: resolve(__dirname, 'samples/sample_5.html'),
        sample_6: resolve(__dirname, 'samples/sample_6.html'),
        sample_7: resolve(__dirname, 'samples/sample_7.html'),
        sample_8: resolve(__dirname, 'samples/sample_8.html'),
        sample_9: resolve(__dirname, 'samples/sample_9.html'),
        sample_10: resolve(__dirname, 'samples/sample_10.html'),
      },
    },
  },
});
