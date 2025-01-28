import fs from 'fs'
import { utilService } from "./util.service.js"

const bugs = utilService.readJsonFile('data/bugs.json')
const PAGE_SIZE = 3
export const bugService = {
    query,
    save,
    getById,
    remove,
}

function query(queryBy) {
    let {filter,sort,pageIdx} = queryBy
    filter = JSON.parse(filter)
    sort = JSON.parse(sort)
    return Promise.resolve(bugs)
    .then(bugs => {
        if (filter.txt) {
            const regExp = new RegExp(filter.txt, 'i')
            bugs = bugs.filter(bug => regExp.test(bug.title))
        }

        if (filter.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filter.minSeverity)
        }
        if(sort.title){
            bugs = bugs.sort((b1,b2)=> b1.title.localeCompare(b2.title) *sort.title )
        }
        if(sort.severity){
            bugs = bugs.sort((b1,b2) => (b1.severity-b2.severity) *sort.severity)
        }
        if(sort.createdAt){
            bugs = bugs.sort((b1,b2) => (b1.createdAt-b2.createdAt) *sort.createdAt)
        }
        if (pageIdx !== undefined) {
            const startIdx = pageIdx * PAGE_SIZE // 0,3,6,9
            bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return bugs
    })
}

function getById(bugId){
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot remove bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {

    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}