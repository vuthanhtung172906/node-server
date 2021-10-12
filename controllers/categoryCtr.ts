import { Request, Response } from 'express';
import categoryModel from '../models/categoryModel';

const categoryCtr = {
  getCategory: async (req: Request, res: Response) => {
    try {
      const categoryList = await categoryModel.find();
      return res.json(categoryList);
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const category = await categoryModel.findOne({ name });
      if (category) return res.status(400).json({ msg: 'This category already exists' });
      const newCategory = new categoryModel({ name });
      await newCategory.save();
      res.json({ msg: 'Create category success !' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      await categoryModel.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Deleted a category success' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      await categoryModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
      });
      res.json({ msg: 'Update a category success' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
};

export default categoryCtr;
