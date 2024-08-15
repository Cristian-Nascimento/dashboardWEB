import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import TransactionEdit from './TransactionEdit';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const url = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

const Dashboard = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    totalInput: 0,
    totalOutput: 0,
    balance: 0,
    count: 0,
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const params = { userId };
      if (dateRange[0] && dateRange[1]) {
        params.start = dateRange[0].toISOString().split('T')[0];
        params.end = dateRange[1].toISOString().split('T')[0];
      }

      const response = await axios.get(`${url}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTransactions(response.data.rows);
      setTotals({
        totalInput: response.data.sumInput,
        totalOutput: response.data.sumOutput,
        balance: response.data.balance,
        count: response.data.count,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (!auth || !token) {
      navigate('/login');
      return;
    }
    fetchTransactions();
  }, [auth, navigate, dateRange]);

  const handleAddTransaction = async (transaction) => {
    try {
      await axios.post(
        `${url}/transactions/${userId}`,
        transaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${url}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      updatedTransaction.userId = userId;
      await axios.put(`${url}/transactions/${updatedTransaction.id}`,
        updatedTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuth(null);
    navigate('/login');
  };

  const processTransactions = () => {
    const monthlyData = {
      Entrada: Array(12).fill(0),
      Saída: Array(12).fill(0),
    };

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.getUTCMonth();
      if (transaction.type === 'Entrada') {
        monthlyData.Entrada[month] += parseFloat(transaction.amount);
      } else {
        monthlyData.Saída[month] += parseFloat(transaction.amount);
      }
    });

    return monthlyData;
  };

  const monthlyData = processTransactions();

  const lineData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Entrada',
        data: monthlyData.Entrada,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Saída',
        data: monthlyData.Saída,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10000,
      },
    },
  };

  const handleApplyFilter = (selectedDates) => {
    setDateRange(selectedDates);
    setShowCalendar(false);
  };

  const handleClearFilter = () => {
    setDateRange([null, null]);
    fetchTransactions();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <button onClick={() => setShowCalendar(!showCalendar)} className="filter-button">
            Selecionar Período
          </button>
          <button onClick={handleClearFilter} className="filter-button">
            Limpar Filtros
          </button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      {showCalendar && (
        <div className="calendar-popup">
          <Calendar
            selectRange
            onChange={handleApplyFilter}
            value={dateRange}
            className="calendar"
          />
        </div>
      )}
      <section className="dashboard-content">
        <TransactionForm onAddTransaction={handleAddTransaction} />
        <div className="charts">
          <div className="chart-container">
            <h3>Resumo das Transações</h3>
            <Line data={lineData} options={lineOptions} />
            <div className="totals">
              <p>Total de Entrada: {totals.totalInput}</p>
              <p>Total de Saída: {totals.totalOutput}</p>
              <p>Balanço: {totals.balance}</p>
              <p>Contador: {totals.count}</p>
            </div>
          </div>
        </div>
        <TransactionTable
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={setEditingTransaction}
          totals={totals}
        />
        {editingTransaction && (
          <TransactionEdit
            transaction={editingTransaction}
            onSave={handleEditTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
