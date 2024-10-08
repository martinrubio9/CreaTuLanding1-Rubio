
import React from 'react';
import './ItemListContainer.css'; 

const ItemListContainer = (props) => {
  return (
    <div className="item-list-container">
      <h1>{props.greeting}</h1>
      {/* Aca van los productos */}
    </div>
  );
}

export default ItemListContainer;
