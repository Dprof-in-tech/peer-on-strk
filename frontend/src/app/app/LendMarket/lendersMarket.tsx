"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../Nav";
import Sidebar from "../sidebar";
import { LenderData } from "../../../data/LenderData";

// Constants
const ITEMS_PER_PAGE = 7;

// Types
type ModalType = "create" | "counter";

// Component for the header section
const Header = () => (
  <div className="flex p-4">
    <div className="flex gap-3 justify-center items-center">
      <Link href="/app">
        <Image
          src="/images/back-button.svg"
          height={40}
          width={40}
          alt="back-button"
          className="cursor-pointer"
        />
      </Link>
      <div className="flex gap-2 pb-2">
        <p className="text-black text-xl md:text-2xl lg:text-4xl">
          Lend Market
        </p>
        <div className="flex gap-2 border rounded-3xl text-black border-gray-500 w-24 items-center justify-center">
          <Image
            src="/images/starknet.png"
            height={20}
            width={20}
            alt="starknet-logo"
            className=""
          />
          <p className="text-xs">Starknet</p>
        </div>
      </div>
    </div>
  </div>
);

// Component for the table header
const TableHeader = () => (
  <div className="grid grid-cols-6 pt-6 rounded-t-xl bg-smoke-white py-4 min-w-[800px]">
    <div className="text-center font-semibold">Merchant</div>
    <div className="text-center font-semibold">Quantity</div>
    <div className="text-center font-semibold">Net Value</div>
    <div className="text-center font-semibold">Interest Rate</div>
    <div className="text-center font-semibold">Duration</div>
    <div className="text-center font-semibold">Actions</div>
  </div>
);

// Component for table rows
interface TableRowProps {
  row: any;
  onCounter: () => void;
}

const TableRow = ({ row, onCounter }: TableRowProps) => (
  <div className="grid grid-cols-6 border-t border-gray-300 min-w-[800px]">
    <div className="flex items-center justify-center px-4 py-6">
      <Image
        src="/images/phantom-icon.svg"
        height={20}
        width={20}
        alt="phantomicon"
      />
      <p className="font-medium ml-2">{row.merchants}</p>
    </div>
    <div className="text-left mx-auto px-4 py-6">
      <p className="font-medium">{row.quantity}</p>
    </div>
    <div className="text-center px-4 py-6">
      <p className="font-medium">{row.netValue}</p>
    </div>
    <div className="text-center px-4 py-6">
      <p className="font-medium">{row.interestRate}%</p>
    </div>
    <div className="text-center px-4 py-6">
      <p className="font-medium">{row.duration} days</p>
    </div>
    <div className="flex gap-6 mx-auto">
      <button className="px-2 text-sm rounded-full bg-[rgba(0,0,0,0.8)] my-5 text-white w-20 h-8">
        Lend
      </button>
      <Image
        src="/images/edit.svg"
        alt="counter-proposal"
        width={15}
        height={20}
        className="cursor-pointer"
        onClick={onCounter}
      />
    </div>
  </div>
);

// Component for the proposal form in modal
interface ProposalFormProps {
  interestRate: number;
  interestRateInput: string;
  onInterestRateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onManualInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProposalForm = ({
  interestRate,
  interestRateInput,
  onInterestRateChange,
  onManualInputChange,
}: ProposalFormProps) => (
  <div className="space-y-4 px-10 py-6">
    <div>
      <label className="text-sm text-gray-500 pl-2">Quantity</label>
      <div className="p-3 border rounded-xl border-gray-600">
        <input
          type="text"
          className="w-full outline-none pl-8 text-black"
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <label className="text-sm text-gray-500 pl-2">Duration (Days)</label>
      <div className="p-3 border rounded-xl border-gray-600">
        <input
          type="text"
          className="w-full outline-none pl-8 text-black"
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <label className="text-sm text-gray-500 pl-2">Interest Rate (%)</label>
      <div className="flex flex-col items-center text-black">
        <input
          type="range"
          min="0"
          max="100"
          value={interestRate}
          onChange={onInterestRateChange}
          className="w-full h-2 rounded-lg cursor-pointer appearance-none focus:outline-none"
          style={{
            background: `linear-gradient(to right, #1e1e1e ${interestRate}%, #e0e0e0 ${interestRate}%)`,
          }}
        />
        <div className="flex justify-between w-full text-black">
          <span className="text-black font-medium">{interestRate}%</span>
          <input
            type="number"
            value={interestRateInput}
            onChange={onManualInputChange}
            className="border border-gray-300 mt-2 rounded p-1 w-16 text-center focus:outline-none focus:ring-0 focus:border-gray-400"
            placeholder="Rate"
          />
        </div>
      </div>
    </div>
  </div>
);

// Modal Component
interface ProposalModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  interestRate: number;
  interestRateInput: string;
  onInterestRateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onManualInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProposalModal = ({
  isOpen,
  type,
  onClose,
  interestRate,
  interestRateInput,
  onInterestRateChange,
  onManualInputChange,
}: ProposalModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg h-auto p-4 sm:p-8 relative">
        <button
          className="absolute top-4 right-4 text-black text-2xl sm:text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-center text-lg sm:text-xl text-black mb-4">
          {type === "create" ? "Create a Proposal" : "Counter Proposal"}
        </h2>

        {/* Form Section */}
        <ProposalForm
          interestRate={interestRate}
          interestRateInput={interestRateInput}
          onInterestRateChange={onInterestRateChange}
          onManualInputChange={onManualInputChange}
        />

        <div className="flex justify-center mt-6 mb-5">
          <button
            className="bg-[rgba(0,0,0,0.8)] text-white px-6 py-2 rounded-md text-sm sm:text-base"
            onClick={onClose}
          >
            Submit
          </button>
        </div>

        {/* Footer Section */}
        <div className="flex items-center gap-2  justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <small className="text-gray-500 text-xs sm:text-sm">
            Powered By Peer Protocol
          </small>
          <Image
            src="/images/LogoBlack.svg"
            height={20}
            width={20}
            alt="peer-protocol-logo"
            className="opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: any;
  totalPages: any;
  onPageChange: any;
}) => (
  <div className="flex justify-end p-4">
    <div className="flex gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`px-4 py-2 ${
            currentPage === index + 1
              ? "bg-[rgba(0,0,0,0.8)] text-white"
              : "bg-[#F5F5F5] text-black border-black border"
          } rounded-lg`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </div>
);

// Main Lender Component
const Lender = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("create");
  const [interestRate, setInterestRate] = useState(0);
  const [interestRateInput, setInterestRateInput] = useState("");

  const totalPages = Math.ceil(LenderData.length / ITEMS_PER_PAGE);
  const currentData = LenderData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setModalOpen(true);
    setInterestRate(0);
    setInterestRateInput("");
  };

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setInterestRate(value);
    setInterestRateInput(event.target.value);
  };

  const handleManualInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInterestRateInput(value);
    setInterestRate(Number(value));
  };

  return (
    <main className="bg-[#F5F5F5] backdrop-blur-sm">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full max-h-screen overflow-auto">
          <Nav />
          <Header />

          <div className="overflow-x-auto text-black border border-gray-300 mx-4 mb-4">
            <TableHeader />
            <div className="w-full">
              {currentData.map((row, index) => (
                <TableRow
                  key={index}
                  row={row}
                  onCounter={() => handleOpenModal("counter")}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleOpenModal("create")}
            className="relative flex items-center gap-2 px-6 py-3 rounded-3xl bg-[#F5F5F5] text-black border border-[rgba(0,0,0,0.8)] mx-auto font-light hover:bg-[rgba(0,0,0,0.8)] hover:text-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p>Create a Proposal</p>
            <Image
              src={
                isHovered ? "/images/MathPlusHover.png" : "/images/PlusMath.svg"
              }
              height={40}
              width={20}
              alt="plus"
              className="transition-opacity duration-300 ease-in-out"
            />
          </button>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <ProposalModal
            isOpen={isModalOpen}
            type={modalType}
            onClose={() => setModalOpen(false)}
            interestRate={interestRate}
            interestRateInput={interestRateInput}
            onInterestRateChange={handleInterestRateChange}
            onManualInputChange={handleManualInputChange}
          />
        </div>
      </div>
    </main>
  );
};

export default Lender;
