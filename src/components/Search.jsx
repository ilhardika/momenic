import { Search as SearchIcon } from "lucide-react";

const Search = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative max-w-xl mx-auto">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 pr-12 rounded-full border border-[#3F4D34]/20 
                 focus:outline-none focus:border-[#3F4D34]/40 
                 font-secondary text-[#3F4D34]"
      />
      <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3F4D34]/40" />
    </div>
  );
};

export default Search;