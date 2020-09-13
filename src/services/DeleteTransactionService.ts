import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactionsExists = await transactionsRepository.findOne(id);

    if (!transactionsExists) {
      throw new AppError('Transaction does not exists');
    }

    await transactionsRepository.remove(transactionsExists);
  }
}

export default DeleteTransactionService;
