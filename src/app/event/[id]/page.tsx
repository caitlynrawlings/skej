// app/event/[id]/page.tsx
"use client"  // may want to change this to be server side later in dev
import { GetServerSideProps } from 'next';
import { useParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductPageProps {
  event: Product;
}

const EventPage: React.FC<ProductPageProps> = ({ event }) => {
  const { id } = useParams();

  return (
    <div>
      <h1>event id: {id}</h1>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.params as { id: string };

//   // Fetch product data based on the ID
//   const res = await fetch(`https://api.example.com/products/${id}`);
//   const product = await res.json();

//   if (!product) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export default EventPage;
