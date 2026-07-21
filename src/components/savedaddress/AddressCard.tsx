import { Address } from "@/types/address"

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  return (
    <div
      className="
        bg-white
        border
        border-[#d6c2be]/30
        rounded-xl
        p-5
        md:p-8
        flex
        flex-col
        justify-between
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-6">
          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              tracking-widest
              uppercase
              ${
                address.isDefault
                  ? "bg-[#fbdeb9] text-[#705b3e]"
                  : "bg-[#f5f3ef] text-[#524440]"
              }
            `}
          >
            {address.label}
          </span>

          {address.isDefault && (
            <span className="text-[#845145] text-xs font-semibold flex items-center gap-1">
              ✓ Default
            </span>
          )}
        </div>


        {/* Customer info */}
        <h3
          className="
            text-xl
            md:text-2xl
            font-medium
            text-[#845145]
            mb-2
          "
          style={{
            fontFamily: "Playfair Display",
          }}
        >
          {address.name}
        </h3>


        <p className="text-[#524440] text-sm md:text-base mb-1">
          {address.phone}
        </p>


        <p
          className="
            text-[#524440]
            text-sm
            md:text-base
            leading-relaxed
          "
        >
          {address.address}
          <br />
          {address.city}, {address.state}
          <br />
          {address.postcode}
          <br />
          {address.country}
        </p>

      </div>


      {/* Actions */}
      <div
        className="
          mt-8
          pt-5
          border-t
          border-[#d6c2be]/30
          flex
          gap-6
        "
      >
        <button
          className="
            text-[#845145]
            text-sm
            font-semibold
            hover:opacity-70
          "
        >
          Edit
        </button>

        <button
          className="
            text-[#524440]
            text-sm
            font-semibold
            hover:text-red-500
          "
        >
          Delete
        </button>
      </div>

    </div>
  );
}