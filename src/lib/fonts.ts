import { Playfair_Display, DM_Mono, Noto_Sans_JP } from 'next/font/google';

export const playfair = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const dmMono = DM_Mono({
  weight: ['300', '400'],
  subsets: ['latin'],
  display: 'swap',
});

export const notoSansJP = Noto_Sans_JP({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
});
