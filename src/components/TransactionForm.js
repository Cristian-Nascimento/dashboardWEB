import React, { useState } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [descriptionText, setDescriptionText] = useState('Pix');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Entrada');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({ description, descriptionText, amount, date, type });
    setDescription('');
    setDescriptionText('Pix');
    setAmount('');
    setDate('');
    setType('Entrada');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        value={descriptionText}
        onChange={(e) => setDescriptionText(e.target.value)}
      >
        <option value="Pix">Pix</option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão de Crédito">Cartão de Crédito</option>
        <option value="Cartão de Débito">Cartão de Débito</option>
        <option value="Boleto">Boleto</option>
        <option value="Cartão de Alimentação">Cartão de Alimentação</option>
      </select>
      <input
        type="text"
        placeholder="Valor"
        value={amount}
        onChange={handleAmountChange}
        onBlur={() => {
          const numericValue = parseFloat(amount.replace(/,/g, ''));
          if (!isNaN(numericValue)) {
            setAmount(numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
          }
        }}
        required
      />
      <input
        type="date"
        placeholder="Data"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Entrada">Entrada</option>
        <option value="Saída">Saída</option>
      </select>
      <button type="submit" className="submit-button">Add</button>
    </form>
  );
};

export default TransactionForm;
