const { useState, useEffect,useRef  } = React

export function BugFilter({ queryOptions, onSetQueryrBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(queryOptions.filter)
    const [sortBY,setSortBY] = useState(queryOptions.sort)
    const [sortdir,setSortdir] = useState(queryOptions.sort[Object.keys(queryOptions.sort)[0]])
   
    useEffect(() => {
        const queryOptions = {filter:filterByToEdit,sort:sortBY}
        onSetQueryrBy(queryOptions)
    }, [filterByToEdit,sortBY,sortdir])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }
    function handleSortChange({target}){
        if(target.name === 'sort'){

            const newSort = {[target.value]:sortdir}
            setSortBY(prevSort => newSort)
        }else{
            const newSort = {[Object.keys(sortBY)[0]]:sortBY[Object.keys(sortBY)[0]] *-1}
            setSortBY(prevSort => newSort)
        }
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        const queryOptions = {filter:filterByToEdit,sort:sortBY}
        onSetQueryrBy(queryOptions)
    }
    function changeDir(){
        setSortdir(prevdir => prevdir*-1)
    }
    const { txt, minSeverity,label } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
                    
                
                <label htmlFor="label">By lable: </label>
                <select name="label" onChange={handleChange}>
                <option value="">chose lable filter</option>
                    <option value="critical">critical</option>
                    <option value="frontend">frontend</option>
                    <option value="dev-branch">dev-branch</option>
                    <option value="urgent">urgent</option>
                    <option value="backend">backend</option>
                    <option value="performance">performance</option>
                    </select>

                    <label htmlFor="sort">Sort by:</label>
                    <select name="sort" onChange={handleSortChange}>
                    <option value="title">title</option>
                    <option value="severity">severity</option>
                    <option value="createdAt">createdAt</option>
                    </select>

                    <label>
                    <span>Descending</span>
                    <input name="dir"   type="checkbox"  onChange={handleSortChange} />
                </label>
            </form>
        </section>
    )
}