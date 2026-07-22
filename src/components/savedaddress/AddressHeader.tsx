interface AddressHeaderProps {
    onAdd: () => void;
}


export default function AddressHeader({
    onAdd
}: AddressHeaderProps) {

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
                        text-[#845145]
                    "
                    style={{
                        fontFamily: "Playfair Display"
                    }}
                >
                    Saved Addresses
                </h1>

                {/* <p className="
                    text-[#524440]
                    mt-3
                ">
                    Manage your delivery locations
                </p> */}
            </div>
            <button
                onClick={onAdd}
                className="
                    mt-5
                    md:mt-0
                    bg-[#845145]
                    text-white
                    px-8
                    py-3
                    rounded-full
                    "
            >
                + Add New Address
            </button>
        </div>
    )

}