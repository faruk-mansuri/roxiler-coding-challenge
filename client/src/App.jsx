import React, { useEffect, useRef, useState } from 'react';
import customFetch from './lib/customFetch';

import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SingleProduct from './components/SingleProduct';
import { Loader2 } from 'lucide-react';
import Stats from './components/Stats';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [month, setMonth] = useState(MONTHS[0]);
  const [data, setData] = useState({
    currentPage: 1,
    numOfPages: 0,
    products: [],
    productsPerPage: 0,
    totalProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const createProducts = async () => {
  //     try {
  //       const { data } = await customFetch.post('/products');
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   createProducts();
  // }, []);

  const nextBtnHandler = () => {
    if (data.currentPage === data.numOfPages) {
      setData((prevData) => {
        return { ...prevData, currentPage: 1 };
      });
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          currentPage: prevData.currentPage + 1,
        };
      });
    }
  };
  const prevBtnHandler = () => {
    if (data.currentPage === 1) {
      setData((prevData) => {
        return { ...prevData, currentPage: prevData.numOfPages };
      });
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          currentPage: prevData.currentPage - 1,
        };
      });
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);

        const { data: _data } = await customFetch.get(
          `/products/${month}?searchTerm=${searchTerm}&page=${data.currentPage}`
        );
        setData(_data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeOutID = setTimeout(() => {
      getProducts();
    }, 750);

    return () => clearTimeout(timeOutID);
  }, [searchTerm, month, data.currentPage]);

  return (
    <div className='bg-gray-200 min-h-svh bg-gradient-to-r from-purple-300 to-blue-400 py-10 md:px-5 space-y-10'>
      <div className='space-y-8 max-w-screen-xl mx-auto px-2'>
        <h1 className='text-4xl text-slate-800 text-center font-semibold tracking-wide'>
          Transaction Dashboard
        </h1>

        <div className='flex justify-between max-w-lg mx-auto'>
          <Input
            className='w-56 md:w-80  border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={setMonth} value={month} defaultValue={month}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue defaultValue={month} placeholder={month} />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => {
                return (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3'>
          {isLoading ? (
            <div className='flex justify-center w-full'>
              <Loader2 className='h-12 w-12 animate-spin' />
            </div>
          ) : data.products.length === 0 ? (
            <div>
              <h1 className='text-2xl font-semibold text-center'>
                No items found
              </h1>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
              {data.products.map((product) => {
                return <SingleProduct key={product._id} product={product} />;
              })}
            </div>
          )}
          {/* PAGINATION */}

          <div className='flex justify-between'>
            <p className='text-sm'>page no: {data.currentPage}</p>

            <div className='space-x-2'>
              <Button
                disabled={isLoading}
                size='sm'
                variant='ghost'
                onClick={prevBtnHandler}
              >
                prev
              </Button>
              <Button
                disabled={isLoading}
                size='sm'
                variant='ghost'
                onClick={nextBtnHandler}
              >
                next
              </Button>
            </div>

            <p className='text-sm'>per page: {data.productsPerPage}</p>
          </div>
        </div>
      </div>

      <Stats month={month} />
    </div>
  );
};

export default App;
