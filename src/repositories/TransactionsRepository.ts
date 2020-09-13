import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    const incomeTransactions = transactions.filter(transaction => {
      return transaction.type === 'income';
    });

    const totalIncomesTransactions = incomeTransactions.reduce(
      (totalIncome, item) => {
        return totalIncome + item.value;
      },
      0,
    );

    const outcomeTransactions = transactions.filter(transaction => {
      return transaction.type === 'outcome';
    });

    const totalOutcomesTransactions = outcomeTransactions.reduce(
      (totalIncome, item) => {
        return totalIncome + item.value;
      },
      0,
    );

    return {
      income: totalIncomesTransactions,
      outcome: totalOutcomesTransactions,
      total: totalIncomesTransactions - totalOutcomesTransactions,
    };
  }
}

export default TransactionsRepository;
