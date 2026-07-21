"use client";

import { useState } from "react";


interface AddressFormProps {
  onClose: () => void;
}


export default function AddressForm({
  onClose,
}: AddressFormProps) {


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/30
        flex
        justify-end
      "
    >

      {/* Modal */}
      <div
        className="
          w-full
          md:max-w-md
          h-full
          bg-[#fbf9f5]
          p-6
          md:p-8
          overflow-y-auto
        "
      >

        {/* Header */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-8
          "
        >

          <h2
            className="
              text-2xl
              text-[#845145]
            "
            style={{
              fontFamily:"Playfair Display"
            }}
          >
            Add Address
          </h2>


          <button
            onClick={onClose}
            className="
              text-xl
              text-gray-500
            "
          >
            ✕
          </button>

        </div>


        {/* Form */}

        <div className="space-y-5">


          <input
            placeholder="Full Name"
            className="
              w-full
              p-4
              rounded-lg
              bg-white
              outline-none
            "
          />


          <input
            placeholder="Phone Number"
            className="
              w-full
              p-4
              rounded-lg
              bg-white
              outline-none
            "
          />


          <input
            placeholder="Address"
            className="
              w-full
              p-4
              rounded-lg
              bg-white
              outline-none
            "
          />


          <div className="grid grid-cols-2 gap-4">

            <input
              placeholder="City"
              className="
                w-full
                p-4
                rounded-lg
                bg-white
                outline-none
              "
            />

            <input
              placeholder="State"
              className="
                w-full
                p-4
                rounded-lg
                bg-white
                outline-none
              "
            />

          </div>


          <input
            placeholder="Postcode"
            className="
              w-full
              p-4
              rounded-lg
              bg-white
              outline-none
            "
          />


        </div>


        {/* Buttons */}

        <div
          className="
            mt-10
            space-y-3
          "
        >

          <button
            className="
              w-full
              py-4
              rounded-full
              bg-[#845145]
              text-white
            "
          >
            Save Address
          </button>


          <button
            onClick={onClose}
            className="
              w-full
              py-4
              rounded-full
              border
              border-[#d6c2be]
            "
          >
            Cancel
          </button>

        </div>


      </div>

    </div>
  );
}