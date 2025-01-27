import express from 'express' 
import {bugService} from './services/bug.service.js'
const app = express() 
app.use(express.static('public'))

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
        severity: +req.query.severity
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            res.status(500).send('Cannot save bug')
        })
})


// get by id
app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params
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