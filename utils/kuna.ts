export enum Currency {
  Kuna = 'kuna',
  Euro = 'euro',
}

class Kuna {
  exchange(amount: number, rate: number) {
    return new (class {
      from(from: Currency) {
        return new (class {
          to(to: Currency) {
            let result = 0;
            if (from === Currency.Kuna) {
              if (to === Currency.Euro) {
                result = amount * rate;
              } else {
                result = amount;
              }
            } else if (from === Currency.Euro) {
              if (to === Currency.Kuna) {
                result = amount / rate;
              } else {
                result = amount;
              }
            }

            return result;
          }
        })();
      }
    })();
  }
}

export const kuna = new Kuna();
export default kuna;
