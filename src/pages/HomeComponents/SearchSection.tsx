import SearchInput from "../../components/ui/SearchInput/SearchInput";
const SearchSection = () => {
return (
    <div className='max-w-[1300px] mx-auto -mt-16 md:-mt-20 mb-20 md:mb-36 px-4'>
        <div className="bg-light rounded-2xl md:rounded-3xl items-center flex flex-col pb-4 shadow-lg">
            <SearchInput />
        </div>
    </div>
);
}

export default SearchSection;