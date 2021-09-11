const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <input
        value={searchQuery}
        onInput={q => setSearchQuery(q.target.value)}
        type="text"
        id="searchBar"
        placeholder="Search..."
        name="s"
    />
);

export default SearchBar;
