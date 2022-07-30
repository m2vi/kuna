import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import kuna, { Currency } from '../utils/kuna';
import moment from 'moment';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import rates from '../utils/rates';
import { getMillisecondsTillMidnight } from '../utils/common';

const Home = ({ rate }: { rate: number }) => {
  const [from, setFrom] = useState<Currency>(Currency.Kuna);
  const [fromValue, setFromValue] = useState<number>(0);

  const [amount, setAmount] = useState<number>(0);

  const handleSelectChange = (dest: Dispatch<SetStateAction<Currency>>) => {
    return (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;

      dest(value as Currency);
    };
  };

  const handleChange = (dest: Dispatch<SetStateAction<number>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      if (Number.isNaN(Number(value)) && !Number.isFinite(Number(value)) && !(Number(value) >= 0)) return;

      dest(Number(value));
    };
  };

  useEffect(() => {
    update();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, fromValue]);

  const update = (value?: number) => {
    if (typeof value === 'undefined') value = fromValue;

    setAmount(
      kuna
        .exchange(value, rate)
        .from(from)
        .to(from === Currency.Kuna ? Currency.Euro : Currency.Kuna)
    );
  };

  return (
    <div className='h-screen w-full flex justify-center items-center bg-primary-900 p-1'>
      <Head>
        <title>Kuna</title>
      </Head>

      <div className='rounded-8 bg-primary-800 p-6 w-full max-w-lg grid grid-flow-row gap-3 text-left'>
        <div className='p-3 bg-primary-700 rounded-8 w-full overflow-hidden'>
          <div className='flex items-center justify-between'>
            <input
              onChange={handleChange(setFromValue)}
              type='text'
              placeholder='0'
              className='text-4xl w-full bg-transparent focus:outline-none px-1'
            />

            <select defaultValue={Currency.Kuna} onChange={handleSelectChange(setFrom)}>
              <option value={Currency.Kuna}>HRK</option>
              <option value={Currency.Euro}>EUR</option>
            </select>
          </div>
        </div>

        <div className='w-full text-center mt-6 flex flex-col items-center justify-center'>
          <p className='text-primary-400 text-xs'>As of {moment().format('DD.MM.YYYY')}</p>
          <span className='text-4xl'>
            {amount.toFixed(2)} {from === Currency.Kuna ? 'EUR' : 'HRK'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      rate: await rates.get('HRK', 'EUR'),
    },
  };
};
