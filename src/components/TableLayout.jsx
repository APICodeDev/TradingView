import React from 'react';

const TableLayout = ({ tables, setTables, orders, setOrders, currentOrder, setCurrentOrder, navigateToSales }) => {

  const handleTableClick = (table) => {
    // If table is free, create a new order
    if (table.status === 'free') {
      const newOrderId = Math.max(...Object.keys(orders).map(Number), 0) + 1;
      const newOrder = {
        id: newOrderId,
        tableId: table.id,
        items: [],
        total: 0,
        paymentStatus: 'pending'
      };
      
      setOrders(prev => ({ ...prev, [newOrderId]: newOrder }));
      setTables(prev => 
        prev.map(t => 
          t.id === table.id ? { ...t, status: 'occupied', orderId: newOrderId } : t
        )
      );
      
      setCurrentOrder(newOrder);
      navigateToSales(table.id);
    } 
    // If table is occupied, navigate to existing order
    else if (table.orderId) {
      const order = orders[table.orderId];
      if (order) {
        setCurrentOrder(order);
        navigateToSales(table.id);
      }
    }
  };

  return (
    <div className="table-layout">
      <div className="header">
        <h1>Restaurant POS - Mesa Disponibilidad</h1>
        <div>Total Mesas: {tables.length}</div>
      </div>
      
      <div className="tables-grid">
        {tables.map(table => (
          <div 
            key={table.id}
            className={`table-card ${table.status}`}
            onClick={() => handleTableClick(table)}
          >
            <div>{table.name}</div>
            <div className="table-status">
              {table.status === 'free' && 'Disponible'}
              {table.status === 'occupied' && 'Ocupada'}
              {table.status === 'reserved' && 'Reservada'}
            </div>
            {table.orderId && (
              <div className="table-order">Cuenta: #{table.orderId}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLayout;