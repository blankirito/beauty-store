export type Products = {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    images: string[];
    features: string[];
    isNew?: boolean;
    category: string;
};