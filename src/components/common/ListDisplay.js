import React from "react";

const ListDisplay = ({ title, items, renderItem, noDataText = "No items found." }) => {
  return (
    <div className="mt-4">
      {title && <h2 className="text-xl mb-2">{title}</h2>}
      {items && items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            // Use a unique key from the item if available, fallback to index.
            <li key={item._id || index} className="mb-4 p-4 border rounded shadow">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>{noDataText}</p>
      )}
    </div>
  );
};

export default ListDisplay;
