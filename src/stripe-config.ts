export const products = {
  pro: {
    priceId: 'price_1RNuzLL1ecvY6JSJ3Dxvz5xF',
    name: 'Pro',
    description: 'Pro-jäsenyys.',
    mode: 'subscription' as const,
  },
} as const;

export type Product = keyof typeof products;