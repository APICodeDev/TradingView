import React, { useState, useEffect } from 'react';

const SalesPanel = ({ tables, setTables, orders, setOrders, currentOrder, setCurrentOrder, currentTableId, navigateToPayment, navigateToTableLayout, navigateToTable }) => {
  const [selectedCategory, setSelectedCategory] = useState('Entrantes');
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [newPrice, setNewPrice] = useState('');

  // Sample menu data
  const menuCategories = ['Entrantes', 'Platos Principales', 'Postres', 'Bebidas', 'Especiales'];
  
  const menuItems = {
    'Entrantes': [
      { id: 1, name: 'Ensalada César', price: 8.50, ingredients: ['Lechuga', 'Pollo', 'Parmesano', 'Crutones'] },
      { id: 2, name: 'Bravas', price: 6.00, ingredients: ['Patatas bravas', 'Salsa brava'] },
      { id: 3, name: 'Croquetas', price: 7.50, ingredients: ['Jamón', 'Bechamel'] },
      { id: 4, name: 'Gazpacho', price: 5.50, ingredients: ['Tomate', 'Pimiento', 'Cebolla', 'Ajo'] }
    ],
    'Platos Principales': [
      { id: 5, name: 'Hamburguesa', price: 12.50, ingredients: ['Carne', 'Queso', 'Lechuga', 'Tomate'] },
      { id: 6, name: 'Pasta Carbonara', price: 11.00, ingredients: ['Pasta', 'Bacon', 'Huevo', 'Queso'] },
      { id: 7, name: 'Lomo al Whisky', price: 15.00, ingredients: ['Lomo', 'Salsa de whisky', 'Patatas'] },
      { id: 8, name: 'Pizza Margarita', price: 10.00, ingredients: ['Masa', 'Tomate', 'Mozzarella', 'Albahaca'] }
    ],
    'Postres': [
      { id: 9, name: 'Tiramisú', price: 6.50, ingredients: ['Mascarpone', 'Café', 'Cacao'] },
      { id: 10, name: 'Flan', price: 5.00, ingredients: ['Huevo', 'Leche', 'Caramelo'] },
      { id: 11, name: 'Brownie', price: 6.00, ingredients: ['Chocolate', 'Harina', 'Huevo'] }
    ],
    'Bebidas': [
      { id: 12, name: 'Coca Cola', price: 2.50, ingredients: ['Refresco'] },
      { id: 13, name: 'Agua', price: 1.50, ingredients: ['Agua mineral'] },
      { id: 14, name: 'Cerveza', price: 2.00, ingredients: ['Cerveza'] },
      { id: 15, name: 'Vino Tinto', price: 3.50, ingredients: ['Vino tinto'] }
    ],
    'Especiales': [
      { id: 16, name: 'Degustación', price: 25.00, ingredients: ['Selección de entrantes'] },
      { id: 17, name: 'Menú del Día', price: 12.00, ingredients: ['Primer plato', 'Segundo plato', 'Postre', 'Bebida'] }
    ]
  };

  const currentTable = tables.find(t => parseInt(t.id) === parseInt(currentTableId));
  const currentTableOrder = currentOrder && currentOrder.tableId === parseInt(currentTableId) ? currentOrder : 
                           orders[Object.keys(orders).find(key => orders[key].tableId === parseInt(currentTableId))];

  useEffect(() => {
    if (currentTableOrder) {
      setCurrentOrder(currentTableOrder);
    }
  }, [currentTableOrder, setCurrentOrder]);

  const addToOrder = (item) => {
    if (!currentTableOrder) return;

    const newItem = {
      ...item,
      id: Date.now(), // Unique ID for this order item
      quantity: 1
    };

    const updatedOrder = {
      ...currentTableOrder,
      items: [...currentTableOrder.items, newItem],
      total: currentTableOrder.total + item.price
    };

    setOrders(prev => ({
      ...prev,
      [updatedOrder.id]: updatedOrder
    }));

    setCurrentOrder(updatedOrder);
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;

    const itemIndex = currentTableOrder.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = currentTableOrder.items[itemIndex];
    const priceDifference = (newQuantity - item.quantity) * item.price;

    const updatedItems = [...currentTableOrder.items];
    updatedItems[itemIndex] = { ...item, quantity: newQuantity };

    const updatedOrder = {
      ...currentTableOrder,
      items: updatedItems,
      total: currentTableOrder.total + priceDifference
    };

    setOrders(prev => ({
      ...prev,
      [updatedOrder.id]: updatedOrder
    }));

    setCurrentOrder(updatedOrder);
  };

  const removeItem = (itemId) => {
    const itemIndex = currentTableOrder.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = currentTableOrder.items[itemIndex];
    const updatedItems = currentTableOrder.items.filter(item => item.id !== itemId);
    const newTotal = currentTableOrder.total - (item.price * item.quantity);

    const updatedOrder = {
      ...currentTableOrder,
      items: updatedItems,
      total: newTotal
    };

    setOrders(prev => ({
      ...prev,
      [updatedOrder.id]: updatedOrder
    }));

    setCurrentOrder(updatedOrder);
  };

  const toggleSelectedItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const applyDiscount = () => {
    if (selectedItems.length === 0 || discount <= 0) return;

    const discountAmount = (discount / 100) * selectedItems.reduce((sum, itemId) => {
      const item = currentTableOrder.items.find(i => i.id === itemId);
      return sum + (item.price * item.quantity);
    }, 0);

    const updatedOrder = {
      ...currentTableOrder,
      total: currentTableOrder.total - discountAmount
    };

    setOrders(prev => ({
      ...prev,
      [updatedOrder.id]: updatedOrder
    }));

    setCurrentOrder(updatedOrder);
    setDiscount(0);
    setSelectedItems([]);
  };

  const changeItemPrice = () => {
    if (selectedItems.length !== 1 || !newPrice) return;

    const itemId = selectedItems[0];
    const itemIndex = currentTableOrder.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const oldItem = currentTableOrder.items[itemIndex];
    const priceDifference = (parseFloat(newPrice) - oldItem.price) * oldItem.quantity;

    const updatedItems = [...currentTableOrder.items];
    updatedItems[itemIndex] = { ...oldItem, price: parseFloat(newPrice) };

    const updatedOrder = {
      ...currentTableOrder,
      items: updatedItems,
      total: currentTableOrder.total + priceDifference
    };

    setOrders(prev => ({
      ...prev,
      [updatedOrder.id]: updatedOrder
    }));

    setCurrentOrder(updatedOrder);
    setNewPrice('');
    setSelectedItems([]);
  };

  const sendToKitchen = () => {
    if (selectedItems.length === 0) return;
    alert(`Enviando ${selectedItems.length} platos a cocina`);
    setSelectedItems([]);
  };

  const handlePrintBill = () => {
    alert('Imprimiendo cuenta previa al pago');
  };

  const handleSplitBill = () => {
    if (selectedItems.length === 0) {
      alert('Por favor seleccione al menos un plato para dividir la cuenta');
      return;
    }
    alert(`Dividiendo ${selectedItems.length} platos en una pestaña separada`);
    setSelectedItems([]);
  };

  const handlePayment = () => {
    if (!currentTableOrder || currentTableOrder.items.length === 0) {
      alert('La cuenta está vacía');
      return;
    }
    navigateToPayment(currentTableOrder.id);
  };

  return (
    <div className="sales-panel">
      <div className="sales-header">
        <h1>Mesa {currentTable?.name || currentTableId} - Panel de Venta</h1>
        <button onClick={navigateToTableLayout}>Volver a Mesas</button>
      </div>

      <div className="sales-content">
        {/* Ticket Panel */}
        <div className="ticket-panel">
          <div className="ticket-header">Ticket de Venta</div>
          <div className="ticket-items">
            {currentTableOrder?.items && currentTableOrder.items.length > 0 ? (
              currentTableOrder.items.map(item => (
                <div 
                  key={item.id} 
                  className={`ticket-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelectedItem(item.id)}
                >
                  <div className="ticket-item-name">
                    <div>{item.name} x{item.quantity}</div>
                    <div className="ticket-item-ingredients">{item.ingredients.join(', ')}</div>
                  </div>
                  <div className="ticket-item-price">{(item.price * item.quantity).toFixed(2)}€</div>
                  <div className="order-item-controls">
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemQuantity(item.id, item.quantity - 1);
                        }}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemQuantity(item.id, item.quantity + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      style={{ marginLeft: '5px' }}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>No hay artículos en el ticket</div>
            )}
          </div>
          <div className="ticket-total">Total: {currentTableOrder?.total.toFixed(2) || '0.00'}€</div>
        </div>

        {/* Menu Panel */}
        <div className="menu-panel">
          <div className="category-buttons">
            {menuCategories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="dish-buttons">
            {menuItems[selectedCategory]?.map(item => (
              <button
                key={item.id}
                className="dish-btn"
                onClick={() => addToOrder(item)}
              >
                <div>{item.name}</div>
                <div>{item.price.toFixed(2)}€</div>
              </button>
            ))}
          </div>
        </div>

        {/* Functions Panel */}
        <div className="functions-panel">
          <h3>Funciones</h3>
          
          <button className="function-btn print" onClick={handlePrintBill}>
            Imprimir Cuenta
          </button>
          
          <button className="function-btn split" onClick={handleSplitBill}>
            Dividir Cuenta
          </button>
          
          <div>
            <label>Cambiar Precio (seleccione 1 plato):</label>
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Nuevo precio"
            />
            <button className="function-btn" onClick={changeItemPrice}>
              Aplicar
            </button>
          </div>
          
          <div>
            <label>Aplicar Descuento (%):</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="% descuento"
            />
            <button className="function-btn discount" onClick={applyDiscount}>
              Aplicar
            </button>
          </div>
          
          <button className="function-btn kitchen" onClick={sendToKitchen}>
            Enviar a Cocina
          </button>
          
          <button className="function-btn" onClick={handlePayment}>
            Pagar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPanel;