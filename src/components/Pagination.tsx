import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
interface PaginationProps {
  currentPage: number; // Mevcut sayfa
  totalPages: number; // Toplam sayfa sayısı
  onPageChange: (page: number) => void; // Sayfa değişikliği fonksiyonu
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Sayfalar arasında gezinme fonksiyonları
  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 border bg-blue-600 text-white rounded disabled:opacity-50"
      >
        <FaArrowLeft className="inline-block" />
      </button>

      <span className="font-semibold text-nowrap">Page {currentPage}</span>

      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border bg-blue-600 text-white rounded disabled:opacity-50"
      >
        <FaArrowLeft className="transform rotate-180 inline-block" />
      </button>
    </div>
  );
};

export default Pagination;
