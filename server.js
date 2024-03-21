import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';

import axios from 'axios';

import Products from './models/ProductsModel.js';

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/dist')));

app.post('/api/v1/products', async (req, res) => {
  try {
    if ((await Products.countDocuments()) > 0)
      return res.status(200).json({ msg: 'Already data fetched!' });

    let { data } = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );
    data = data.map(
      ({ title, price, description, category, image, sold, dateOfSale }) => {
        return {
          title,
          price,
          description,
          category,
          image,
          sold,
          dateOfSale,
        };
      }
    );

    await Products.insertMany(data);

    res.status(200).json({ msg: 'Initialize the database with seed data' });
  } catch (error) {
    console.log('CREATE_PRODUCTS_ERROR', error);
    res.status(501).json({ msg: 'Internal Server Error.' });
  }
});

const MONTHS = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

app.get('/api/v1/products/:month', async (req, res) => {
  try {
    const { searchTerm, page } = req.query;
    const { month } = req.params;

    if (!(month in MONTHS)) {
      return res.status(400).json({ msg: 'Invalid month.' });
    }

    const pageNumber = Number(page) || 1;
    const productsPerPage = 10;
    const skip = (pageNumber - 1) * productsPerPage;

    const products = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: {
          month: MONTHS[month],
          $or: [
            { title: { $regex: searchTerm || '', $options: 'i' } },
            { description: { $regex: searchTerm || '', $options: 'i' } },
            { price: Number(searchTerm) },
          ],
        },
      },
    ])
      .skip(skip)
      .limit(productsPerPage);

    const totalProducts = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: {
          month: MONTHS[month],
          $or: [
            { title: { $regex: searchTerm || '', $options: 'i' } },
            { description: { $regex: searchTerm || '', $options: 'i' } },
            { price: Number(searchTerm) },
          ],
        },
      },
    ]);

    const numOfPages = Math.ceil(totalProducts.length / productsPerPage);

    return res.status(200).json({
      totalProducts: totalProducts.length,
      numOfPages,
      currentPage: pageNumber,
      productsPerPage,
      products,
    });
  } catch (error) {
    console.log('PRODUCTS_GET_ERROR', error);
    return res.status(501).json({ msg: 'Internal Server Error.' });
  }
});

app.get('/api/v1/products/statistics/:month', async (req, res) => {
  try {
    const { month } = req.params;
    if (!(month in MONTHS)) {
      return res.status(400).json({ msg: 'Invalid month.' });
    }

    const saleAmount = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: { month: MONTHS[month], sold: true },
      },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const numberOfSoldItems = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: { month: MONTHS[month], sold: true },
      },
    ]);

    const numberOfNotSoldItems = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: { month: MONTHS[month], sold: false },
      },
    ]);

    return res.status(200).json({
      saleAmount,
      numberOfSoldItems: numberOfSoldItems.length,
      numberOfNotSoldItems: numberOfNotSoldItems.length,
    });
  } catch (error) {
    console.log('GET_STATISTICS_ERROR', error);
    return res.status(501).json('Internal Server Error.');
  }
});

app.get('/api/v1/products/bar-chart/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.POSITIVE_INFINITY }, // "above" range
    ];

    if (!(month in MONTHS)) {
      return res.status(400).json({ msg: 'Invalid month.' });
    }

    const products = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: { month: MONTHS[month] },
      },
    ]);

    const stats = priceRanges.map((range) => {
      const count = products.filter(
        ({ price }) => range.min <= price && range.max >= price
      ).length;
      return { date: `${range.min}-${range.max}`, count };
    });

    return res.status(200).json({ stats });
  } catch (error) {
    console.log('GET_BAR_CHART_ERROR', error);
    return res.status(501).json({ msg: 'Internal Server Error.' });
  }
});

app.get('/api/v1/products/pie-chart/:month', async (req, res) => {
  try {
    const { month } = req.params;
    if (!(month in MONTHS)) {
      return res.status(400).json({ msg: 'Invalid month.' });
    }
    // { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
    let stats = await Products.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' },
        },
      },
      {
        $match: { month: MONTHS[month] },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    stats = stats.map((stats) => {
      return { name: stats._id, value: stats.count };
    });

    return res.status(200).json({ stats });
  } catch (error) {
    console.log('GET_PIE_CHART_ERROR', error);
    return res.status(501).json({ msg: 'Internal Server Error.' });
  }
});

app.get('/api/v1/products/all-stats/:month', async (req, res) => {
  try {
    const { month } = req.params;
    if (!(month in MONTHS)) {
      return res.status(400).json({ msg: 'Invalid month.' });
    }

    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all([
        axios.get(
          `https://roxiler-coding-challenge.onrender.com/api/v1/products/statistics/${month}`
        ),
        axios.get(
          `https://roxiler-coding-challenge.onrender.com/api/v1/products/bar-chart/${month}`
        ),
        axios.get(
          `https://roxiler-coding-challenge.onrender.com/api/v1/products/pie-chart/${month}`
        ),
      ]);

    return res.status(200).json({
      statisticsResponse: statisticsResponse.data,
      barChartResponse: barChartResponse.data,
      pieChartResponse: pieChartResponse.data,
    });
  } catch (error) {
    console.log('GET_ALL_STATS_ERROR', error);
    return res.status(501).json({ msg: 'Internal Server Error.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'no found' });
});

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, console.log(`server is listening on port ${port}... `));
} catch (err) {
  console.log(err);
  process.exit(1);
}
