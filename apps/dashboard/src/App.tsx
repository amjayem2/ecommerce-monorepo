import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then((res) => res.json())
      .then((data) =>{
        console.log(data)
        setProducts(data)})
      .catch((err) => console.error('API error:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> - ৳{product.price}{' '}
            {product.inStock ? '(In Stock)' : '(Out of Stock)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
