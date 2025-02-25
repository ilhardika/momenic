import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-12">
      <div className="flex justify-center items-center gap-2 max-w-fit mx-auto">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full transition-all duration-200 hover:bg-[#3F4D34]/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5 text-[#3F4D34]" />
        </button>

        <div className="flex items-center gap-2 px-1">
          {[...Array(totalPages)].map((_, i) => {
            if (
              totalPages <= 5 ||
              i === 0 ||
              i === totalPages - 1 ||
              (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-sm
                    ${
                      currentPage === i + 1
                        ? "bg-[#3F4D34] text-white"
                        : "text-[#3F4D34] hover:bg-[#3F4D34]/5"
                    }`}
                >
                  {i + 1}
                </button>
              );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
              return (
                <span
                  key={i}
                  className="w-8 text-center text-[#3F4D34]/60 text-sm select-none"
                >
                  •••
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full transition-all duration-200 hover:bg-[#3F4D34]/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5 text-[#3F4D34]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;