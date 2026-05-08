import { AllDisbursements } from "./all-disbursements";
import { TotalReceivedYTD } from "./total-received-ytd";
import { UpcomingDisbursements } from "./upcoming-disbursements";

function PayoutsTab() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full mb-6">
        <TotalReceivedYTD className="flex-auto lg:flex-1" amount={4500000} />
        <UpcomingDisbursements
          className="flex-auto lg:flex-2"
          disbursements={[]}
        />
      </div>
      <AllDisbursements data={[]} />
    </>
  );
}

export { PayoutsTab };
