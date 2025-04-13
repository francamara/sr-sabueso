export function generateProductCode(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
}

export function formatPrice(value: number): string {
    return `$${value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  