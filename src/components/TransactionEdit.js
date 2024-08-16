// src/components/TransactionEdit.js
import React, { useState, useEffect } from 'react';
import './TransactionEdit.css';

const TransactionEdit = ({ transaction, onSave, onCancel }) => {
  const [description, setDescription] = useState(transaction?.description || '');
  const [descriptionText, setDescriptionText] = useState(transaction?.descriptionText || '');
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [type, setType] = useState(transaction?.type || 'Entrada');
  const [date, setDate] = useState(transaction?.date ? new Date(transaction.date) : new Date());

  useEffect(() => {
    setDescription(transaction?.description || '');
    setDescriptionText(transaction?.descriptionText || '');
    setAmount(transaction?.amount || 0);
    setType(transaction?.type || 'Entrada');
    setDate(transaction?.date ? new Date(transaction.date) : new Date());
  }, [transaction]);

  const handleSave = () => {
    const updatedTransaction = {
      id: transaction.id,
      description,
      descriptionText,
      amount: parseFloat(amount),
      type,
      date: date.toISOString().split('T')[0],
    };
    onSave(updatedTransaction);
  };

  return (
    <div className="transaction-edit-overlay">
      <div className="transaction-edit-container">
        <h2>Editar Transação</h2>
        <label>
          Descrição:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Método:
          <select
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Boleto">Boleto</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="Cartão de Alimentação">Cartão de Alimentação</option>
          </select>
        </label>
        <label>
          Valor:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Tipo:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>
        </label>
        <label>
          Data:
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
          />
        </label>
        <div className="transaction-edit-buttons">
          <button onClick={handleSave}>Salvar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionEdit;
