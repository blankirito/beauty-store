

export default function PaymentHeader() {

    return (

        <div className="
            flex
            flex-col
            md:flex-row
            md:justify-between
            md:items-end
            mb-10
            mb-4
            px-5
            pt-10
            pb-2
        ">
            <div>
                <h1
                    className="
                        text-4xl
                        md:text-5xl
                        text-primary
                        font-display
                    "
                >
                    Payment Method
                </h1>

                {/* <p className="
                    text-[#524440]
                    mt-3
                ">
                    Manage your delivery locations
                </p> */}
            </div>
        </div>
    )

}