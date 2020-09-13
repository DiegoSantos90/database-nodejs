import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('Invalid funds for this transaction');
    }

    const categoriesRepository = getRepository(Category);

    let checkCategoriesExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoriesExists) {
      const insertCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(insertCategory);
    }

    checkCategoriesExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoriesExists?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
