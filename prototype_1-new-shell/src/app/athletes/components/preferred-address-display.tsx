import React from "react";
import { MapPin } from "lucide-react";
import { formatCityStateZip } from "@/lib/formatters";

interface Address {
  street_address?: string;
  extended_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
}

interface PreferredAddressDisplayProps {
  address: Address;
}

function PreferredAddressDisplay({ address }: PreferredAddressDisplayProps) {
  return (
    <>
      {address.street_address && (
        <p className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {address.street_address}
        </p>
      )}
      {address.extended_address && (
        <p className="text-sm ml-6">{address.extended_address}</p>
      )}
      <p className="text-sm ml-6">{formatCityStateZip(address)}</p>
    </>
  );
}

export { PreferredAddressDisplay };
