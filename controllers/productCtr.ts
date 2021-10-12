import { Request, Response } from 'express';
import Products from '../models/productModel';
class APIfeatures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    console.log({ queryStr: this.queryString });
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);

    // gte = greater than or equal
    // lte = lesser than or equal
    // gt = greater than
    // lt = lesser than

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtr = {
  getProducts: async (req: Request, res: Response) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const feature2 = new APIfeatures(Products.find(), req.query).filtering().sorting();
      const totalProduct = await feature2.query;
      const products = await features.query;
      res.json({
        products,
        pagination: {
          _page: req.query.page || 1,
          _limit: req.query.limit || 10,
          _totalCount: totalProduct.length,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  getProductDetail: async (req: Request, res: Response) => {
    try {
      console.log(req.params.id);
      const product = await Products.findById(req.params.id);
      res.json(product);
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  createProduct: async (req: Request, res: Response) => {
    try {
      const {
        title,
        price,
        sold,
        description,
        content,
        images,
        category,
        inStock,
        color,
        capacity,
      } = req.body;
      if (images?.length === 0) return res.status(400).json({ msg: 'No image upload' });
      const newProduct = new Products({
        title,
        price,
        sold,
        description,
        content,
        images,
        category,
        inStock,
        color,
        capacity,
      });
      await newProduct.save();
      res.json({ msg: 'Create a product success' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  updateProduct: async (req: Request, res: Response) => {
    try {
      const {
        title,
        price,
        description,
        content,
        images,
        category,
        inStock,
        color,
        capacity,
        sold,
      } = req.body;
      if (images?.length === 0) {
        return res.status(400).json({ msg: 'No image upload' });
      }

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          price,
          description,
          content,
          images,
          category,
          inStock,
          color,
          capacity,
          sold,
        }
      );
      res.json({ msg: 'Updated Product' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      await Products.findOneAndDelete({ _id: req.params.id });
      res.json({ msg: 'Deleted a Product' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
};

export default productCtr;
