import express from 'express' 
import cookieParser from 'cookie-parser'
import {bugService} from './services/bug.service.js'
const app = express() 
app.use(express.static('public'))
app.use(cookieParser())

app.listen(3032, () => console.log('Server ready at port 3032'))


// get all
app.get('/api/bug',(req, res) =>{
    bugService.query()
                    .then(bugs => res.send(bugs))
                    .catch(err => {
                        res.status(500).send('Cannot get bugs' , err)
                    })

})
// save
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            res.status(500).send('Cannot save bug')
        })
})


// get by id
app.get('/api/bug/:bugId', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || []
    const { bugId } = req.params
    if(!visitedBugs.includes(bugId )){
            if(visitedBugs.length >2) return res.status(401).send('Wait for a bit') 
            else visitedBugs.push(bugId)
            
    }
    res.cookie('visitedBugs', visitedBugs,{ maxAge: 1000 * 7 })
    
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(500).send('Cannot get bug')
        })


})

// remove
app.get('/api/bug/:bugId/remove', (req, res) => {

    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch(err => {
            res.status(500).send('Cannot remove bug')
        })

})