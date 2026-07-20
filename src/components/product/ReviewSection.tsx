import ReviewCard from "./ReviewCard";
import { Star } from "lucide-react";

const reviews = [
    {
        name: "Elena Mitchell",
        date: "2 days ago",
        rating: 5,
        comment: "The texture is amazing and feels very premium. The quality exceeded my expectations.",
    },
    {
        name: "Julian Rossi",
        date: "1 week ago",
        rating: 4,
        comment: "Beautiful product with great packaging. Would definitely recommend.",
    },
    {
        name: "Bob Johnson",
        rating: 3,
        date: "3 weeks ago",
        comment: "It's okay, but I've seen better.",
    },
]

export default function ReviewSection() {
    return (
        <section className="px-5 mt-10">
            <div className="
                flex
                justify-between
                items-center
                mb-6
            ">
                <h2 className="
                    text-2xl
                    font-display
                    font-medium
                ">Customer Reviews</h2>

                <div className="
                    flex
                    items-center
                    gap-1
                    bg-surface-low
                    px-3
                    py-1
                    rounded-full
                ">
                    <Star
                        size={16}
                        className="text-secondary"
                    />

                    <span className="
                        font-semibold
                        text-secondary
                    ">4.9</span>

                    <span className="
                        text-xs
                        text-on-surface-variant
                    ">(128)</span>
                </div>
            </div>

            <div className="
                space-y-4
            ">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.name}
                        name={review.name}
                        date={review.date}
                        rating={review.rating}
                        comment={review.comment}
                     />
                ))}
            </div>

            <button className="
                w-full
                mt-6
                py-3
                rounded-lg
                text-primary
                font-semibold
                hover:bg-primary/5
            ">View All Reviews</button>
        </section>
    );
}