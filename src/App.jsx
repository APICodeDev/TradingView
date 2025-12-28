import React, { useState } from 'react';
import TableLayout from './components/TableLayout';
import SalesPanel from './components/SalesPanel';
import PaymentPanel from './components/PaymentPanel';
import './App.css';

const App = () => {
  const [tables, setTables] = useState([
    { id: 1, name: 'Mesa 1', status: 'free', orderId: null },
    { id: 2, name: 'Mesa 2', status: 'free', orderId: null },
    { id: 3, name: 'Mesa 3', status: 'free', orderId: null },
    { id: 4, name: 'Mesa 4', status: 'occupied', orderId: 1 },
    { id: 5, name: 'Mesa 5', status: 'free', orderId: null },
    { id: 6, name: 'Mesa 6', status: 'free', orderId: null },
    { id: 7, name: 'Mesa 7', status: 'reserved', orderId: null },
    { id: 8, name: 'Mesa 8', status: 'free', orderId: null },
  ]);

  const [orders, setOrders] = useState({
    1: {
      id: 1,
      tableId: 4,
      items: [
        { id: 1, name: 'Hamburguesa', price: 12.50, quantity: 1, ingredients: ['Carne', 'Lechuga', 'Tomate'] },
        { id: 2, name: 'Patatas Fritas', price: 6.00, quantity: 1, ingredients: ['Patatas'] }
      ],
      total: 18.50,
      paymentStatus: 'pending'
    }
  });

  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentView, setCurrentView] = useState('tableLayout'); // 'tableLayout', 'sales', 'payment'
  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const navigateToSales = (tableId) => {
    setCurrentTableId(tableId);
    setCurrentView('sales');
  };

  const navigateToPayment = (orderId) => {
    setCurrentOrderId(orderId);
    setCurrentView('payment');
  };

  const navigateToTableLayout = () => {
    setCurrentView('tableLayout');
  };

  const navigateToTable = (tableId) => {
    setCurrentTableId(tableId);
    setCurrentView('sales');
  };

  return (
    <div className="app">
      {currentView === 'tableLayout' && (
        <TableLayout 
          tables={tables} 
          setTables={setTables}
          orders={orders}
          setOrders={setOrders}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          navigateToSales={navigateToSales}
          navigateToTable={navigateToTable}
        />
      )}
      {currentView === 'sales' && (
        <SalesPanel 
          tables={tables}
          setTables={setTables}
          orders={orders}
          setOrders={setOrders}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          currentTableId={currentTableId}
          navigateToPayment={navigateToPayment}
          navigateToTableLayout={navigateToTableLayout}
          navigateToTable={navigateToTable}
        />
      )}
      {currentView === 'payment' && (
        <PaymentPanel 
          orders={orders}
          setOrders={setOrders}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          orderId={currentOrderId}
          navigateToTableLayout={navigateToTableLayout}
          navigateToSales={navigateToSales}
          currentTableId={currentTableId}
        />
      )}
    </div>
  );
};

export default App;