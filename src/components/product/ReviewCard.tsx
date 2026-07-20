import { Star } from "lucide-react";


type ReviewCardProps = {
    name: string;
    date: string;
    rating: number;
    comment: string;
};


export default function ReviewCard({
    name,
    date,
    rating,
    comment,
}: ReviewCardProps) {

    return (
        <div
            className="
                bg-surface
                rounded-xl
                p-4
                shadow-sm
                border
                border-outline
            "
        >

            <div className="
                flex
                justify-between
                items-start
            ">

                <div className="flex gap-3">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-full
                            bg-primary-container
                            flex
                            items-center
                            justify-center
                            text-primary
                            font-semibold
                        "
                    >
                        {name.charAt(0)}
                    </div>


                    <div>

                        <p className="font-semibold">
                            {name}
                        </p>


                        <p className="
                            text-xs
                            text-on-surface-variant
                        ">
                            {date}
                        </p>

                    </div>

                </div>



                <div className="
                    flex
                    text-secondary
                ">

                    {
                        Array.from({
                            length: rating
                        }).map((_, index) => (
                            <Star
                                key={index}
                                size={14}
                            />
                        ))
                    }

                </div>


            </div>



            <p className="
                mt-4
                text-sm
                text-on-surface-variant
                leading-relaxed
            ">
                {comment}
            </p>


        </div>
    );
}