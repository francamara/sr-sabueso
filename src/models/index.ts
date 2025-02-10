export interface Product {
    id: number;
    name: string;
    description?: string;
    weight: number;
    listPrice: number;
    retailPrice: number;
    stock: number;
    barcode?: string;
    age?: string;
    size?: string;
    createdAt: string;
    updatedAt: string;
    animalId: number;
    lineId: number;
    brandId: number;
    factoryId: number;
    distributors: ProductDistributor[];
  }
  
  export interface Animal {
    id: number;
    name: string;
  }
  
  export interface Line {
    id: number;
    name: string;
  }
  
  export interface Brand {
    id: number;
    name: string;
  }
  
  export interface Distributor {
    id: number;
    name: string;
  }
  
  export interface Factory {
    id: number;
    name: string;
  }
  
  export interface ProductDistributor {
    id: number;
    productId: number;
    distributorId: number;
    stock: number;
    price: number;
  }
  