import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugs'
const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultQuery
}

function query(queryBy = getDefaultQuery()) {
    return axios.get(BASE_URL, { params: queryBy }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL+bugId)
                                    .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId )
                                        .then(res => res.data)
}

function save(bug) {
   
   
    if (bug._id) {
        return axios.put(BASE_URL + bug._id,bug).then(res => res.data)                                  
    }else{
        return axios.post(BASE_URL ,bug).then(res => res.data)
        
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (bugs && bugs.length > 0) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultQuery() {
    return { filter:{txt: '', minSeverity: 0,}, sort:{title:1},  }
}