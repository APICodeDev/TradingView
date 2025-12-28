import React, { useState } from 'react';

const PaymentPanel = ({ orders, setOrders, currentOrder, setCurrentOrder, orderId, navigateToTableLayout, navigateToSales, currentTableId }) => {
  const [paymentMethods, setPaymentMethods] = useState({
    cash: 0,
    card: 0,
    voucher: 0
  });
  const [activeMethod, setActiveMethod] = useState('cash');
  
  const order = orders[orderId] || currentOrder;

  const handlePaymentMethodChange = (method, value) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: parseFloat(value) || 0
    }));
  };

  const calculateTotalPaid = () => {
    return Object.values(paymentMethods).reduce((sum, value) => sum + value, 0);
  };

  const calculateRemaining = () => {
    return order.total - calculateTotalPaid();
  };

  const handlePayment = () => {
    const totalPaid = calculateTotalPaid();
    
    if (totalPaid < order.total) {
      alert(`Faltan ${calculateRemaining().toFixed(2)}€ para completar el pago`);
      return;
    }
    
    if (totalPaid > order.total) {
      const change = totalPaid - order.total;
      alert(`Pago completado. Cambio: ${change.toFixed(2)}€`);
    } else {
      alert('Pago completado correctamente');
    }
    
    // Update order status to paid
    const updatedOrder = {
      ...order,
      paymentStatus: 'paid',
      paymentMethods: { ...paymentMethods }
    };
    
    setOrders(prev => ({
      ...prev,
      [order.id]: updatedOrder
    }));
    
    setCurrentOrder(updatedOrder);
    
    // Navigate back to table layout
    navigateToTableLayout();
  };

  const handleCancel = () => {
    if (window.confirm('¿Está seguro que desea cancelar el pago y volver al panel de venta?')) {
      navigateToSales(order.tableId);
    }
  };

  if (!order) {
    return (
      <div className="payment-panel">
        <div className="payment-header">
          <h1>Error: Pedido no encontrado</h1>
          <button onClick={navigateToTableLayout}>Volver a Mesas</button>
        </div>
        <p>El pedido solicitado no existe.</p>
      </div>
    );
  }

  return (
    <div className="payment-panel">
      <div className="payment-header">
        <h1>Panel de Pago - Cuenta #{order.id}</h1>
        <button onClick={() => navigateToSales(order.tableId)}>Volver a Venta</button>
      </div>

      <div className="payment-content">
        <div className="payment-order-summary">
          <h2>Resumen de la Cuenta</h2>
          <div className="ticket-items">
            {order.items.map(item => (
              <div key={item.id} className="ticket-item">
                <div className="ticket-item-name">
                  <div>{item.name} x{item.quantity}</div>
                  <div className="ticket-item-ingredients">{item.ingredients.join(', ')}</div>
                </div>
                <div className="ticket-item-price">{(item.price * item.quantity).toFixed(2)}€</div>
              </div>
            ))}
          </div>
          <div className="ticket-total">Total: {order.total.toFixed(2)}€</div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Resumen de Pago</h3>
            <p>Total a pagar: <strong>{order.total.toFixed(2)}€</strong></p>
            <p>Total pagado: <strong>{calculateTotalPaid().toFixed(2)}€</strong></p>
            <p>Faltante: <strong>{Math.max(0, calculateRemaining()).toFixed(2)}€</strong></p>
            {calculateRemaining() < 0 && (
              <p>Cambio: <strong>{Math.abs(calculateRemaining()).toFixed(2)}€</strong></p>
            )}
          </div>
        </div>

        <div className="payment-methods">
          <h2>Formas de Pago</h2>
          
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                checked={activeMethod === 'cash'}
                onChange={() => setActiveMethod('cash')}
              /> Efectivo
            </label>
            <input
              type="number"
              step="0.01"
              value={paymentMethods.cash}
              onChange={(e) => handlePaymentMethodChange('cash', e.target.value)}
              placeholder="Cantidad en efectivo"
            />
          </div>
          
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                checked={activeMethod === 'card'}
                onChange={() => setActiveMethod('card')}
              /> Tarjeta
            </label>
            <input
              type="number"
              step="0.01"
              value={paymentMethods.card}
              onChange={(e) => handlePaymentMethodChange('card', e.target.value)}
              placeholder="Cantidad con tarjeta"
            />
          </div>
          
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                checked={activeMethod === 'voucher'}
                onChange={() => setActiveMethod('voucher')}
              /> Voucher
            </label>
            <input
              type="number"
              step="0.01"
              value={paymentMethods.voucher}
              onChange={(e) => handlePaymentMethodChange('voucher', e.target.value)}
              placeholder="Cantidad con voucher"
            />
          </div>
          
          <div className="payment-buttons">
            <button className="payment-btn pay" onClick={handlePayment}>
              Finalizar Pago
            </button>
            <button className="payment-btn cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;