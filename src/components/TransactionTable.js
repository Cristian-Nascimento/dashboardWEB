import React from 'react';
import './TransactionTable.css';

const TransactionTable = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Método</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.descriptionText}</td>
              <td>{transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>{transaction.type}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="buttom-action">
                <button onClick={() => onDeleteTransaction(transaction.id)}>Delete</button>
                <button onClick={() => onEditTransaction(transaction)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
