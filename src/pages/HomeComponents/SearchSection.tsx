import SearchInput from "../../components/ui/SearchInput/SearchInput";
const SearchSection = () => {
return (
    <div className='max-w-[1300px] mx-auto -mt-20 mb-36'>
        <div className="bg-light rounded-3xl items-center flex flex-col  pb-4">
            <SearchInput />
        </div>
    </div>
);
}

export default SearchSection;