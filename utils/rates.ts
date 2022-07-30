import cache from 'memory-cache';

class Rates {
  private date(): { today: string; yesterday: string } {
    return {
      today: new Date().toISOString().split('T')[0],
      yesterday: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    };
  }

  private url(fcurrency: string, currency: string, date: string): string {
    return `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${fcurrency.toLowerCase()}/${currency.toLowerCase()}.json`;
  }

  private async fetch(fcurrency: string, currency: string, date: string): Promise<{ [key: string]: any }> {
    return await fetch(this.url(fcurrency, currency, date))
      .then((res) => res.json())
      .catch(() => null);
  }

  private async getN(fcurrency: string, currency: string): Promise<number> {
    let data = null;

    const { today, yesterday } = this.date();

    data = await this.fetch(fcurrency, currency, today);

    if (!data) {
      data = await this.fetch(fcurrency, currency, yesterday);
    }

    return data?.[currency.toLowerCase()] ?? null;
  }

  private cacheKey(fc: string, f: string) {
    return `${fc}-${f}`.toLowerCase();
  }

  async get(fcurrency: string, currency: string): Promise<number> {
    const key = this.cacheKey(fcurrency, currency);
    const cached = cache.get(key);

    if (cached) {
      return cached;
    }

    const n = await this.getN(fcurrency, currency);

    if (n) {
      cache.put(key, n);
    }

    return n;
  }
}

export const rates = new Rates();
export default rates;
