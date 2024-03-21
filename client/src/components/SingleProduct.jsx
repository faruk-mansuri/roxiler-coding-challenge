import { Card } from '@/components/ui/card';

const SingleProduct = ({ product }) => {
  const { category, description, image, price, sold, title } = product;
  return (
    <Card>
      <div className='w-full'>
        <img
          src={image}
          alt={title}
          className='w-full h-40 object-cover bg-zinc-400 rounded-md rounded-br-none rounded-bl-none'
        />
      </div>

      <div className='relative p-2 bg-purple-100/20 space-y-1'>
        <h3 className='tracking-wide text-sm text-cyan-400'>
          {title.substring(0, 45)}
        </h3>
        <h4 className='text-xs text-zinc-500 '>
          {description.substring(0, 150)}
        </h4>
        <p className='absolute -bottom-6 right-3 text-zinc-800 text-xs bg-orange-300 p-0.5 rounded-md'>
          {' '}
          ₹ {price.toFixed(2)}
        </p>
      </div>

      <div className='flex flex-col items-start  gap-2 p-2'>
        <p className='text-xs'>
          <span className='bg-purple-300/30 p-1 rounded-md text-zinc-700 font-semibold'>
            Category:
          </span>{' '}
          {category}
        </p>

        <p className='text-xs'>
          <span className='bg-purple-300/30 p-1 rounded-md text-zinc-700 text-xs font-semibold'>
            Sold:
          </span>{' '}
          {sold ? 'True' : 'False'}
        </p>
      </div>
    </Card>
  );
};

export default SingleProduct;
