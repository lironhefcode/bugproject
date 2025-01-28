const { useState, useEffect } = React


import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [queryOptions, setQuertBy] = useState(bugService.getDefaultQuery())

    useEffect(loadBugs, [queryOptions])

    function loadBugs() {
        bugService.query(queryOptions)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            severity: +prompt('Bug severity?', 3),
            description : prompt('enter bug description')
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const  description = prompt('enter bug description',bug.description)
        const bugToSave = { ...bug, severity,description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetQueryrBy(queryOptions) {
        console.log(queryOptions)
        setQuertBy(prevQueryOptions => ({ ...prevQueryOptions, ...queryOptions }))
    }
    function onTogglePagination() {
        setQuertBy(prevQueryOptions => {
            return {
                ...prevQueryOptions,
                pageIdx: (prevQueryOptions.pageIdx === undefined) ? 0 : undefined
            }
        })
    }

    function onChangePage(diff) {
        if (queryOptions.pageIdx === undefined) return
        // console.log('diff:', diff)
        setQuertBy(prevQueryOptions => {
            let nextPageIdx = prevQueryOptions.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevQueryOptions, pageIdx: nextPageIdx }
        })
    }
    return <section className="bug-index main-content">
        
        <BugFilter queryOptions={queryOptions} onSetQueryrBy={onSetQueryrBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <section>
                <button onClick={onTogglePagination}>Toggle Pagination</button>
                <button onClick={() => onChangePage(-1)}>-</button>
                {queryOptions.pageIdx + 1 || 'No Pagination'}
                <button onClick={() => onChangePage(1)}>+</button>
            </section>
        <BugList 
            bugs={bugs} 
            onRemoveBug={onRemoveBug} 
            onEditBug={onEditBug} />
    </section>
}
